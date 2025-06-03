import React, { useCallback, useState, useContext, useMemo } from 'react';
import _ from 'lodash';
import styled from '@emotion/styled';
import { usePage, Link, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import route from 'ziggy-js';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableFooter,
  IconButton,
  Collapse,
  TableRowProps,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TablePagination,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';
import FormLayout, { Section } from '../../src/FormLayout';

const CTX = React.createContext<CTXProps>({
  setDialog: () => {
    //
  },
  setId: () => 0,
});
export default function Recipes() {
  const { t } = useTranslation();
  const [dialog, setDialog] = useState<RootDialog | null>(null);
  const [id, setId] = useState(0);

  return (
    <CTX.Provider value={useMemo(() => ({ setDialog, setId }), [])}>
      <FormLayout>
        <Section title={t('Published recipes')}>
          <RecipesTable />
          <Actions>
            <Button
              color="secondary"
              LinkComponent={Link}
              href={route('new-recipe')}
            >
              {t('Add new')}
            </Button>
          </Actions>
        </Section>
      </FormLayout>
      <Dialog maxWidth="sm" open={Boolean(dialog)}>
        <DialogTitle>{dialog ? dialog.title : ''}</DialogTitle>
        <DialogContent>
          <div
            dangerouslySetInnerHTML={{ __html: dialog ? dialog.content : '' }}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={() => setDialog(null)}>
            {t('Close')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={Boolean(id)}>
        <DialogTitle>
          {t(`Are you sure you want delete the recipe ID ${id}?`)}
        </DialogTitle>
        <DialogActions>
          <Button
            color="error"
            onClick={() => {
              router.get(
                route('delete-recipe', { id }),
                {},
                {
                  onFinish: () => setId(0),
                },
              );
            }}
          >
            {t('Do it!!')}
          </Button>
          <Button color="secondary" onClick={() => setId(0)}>
            {t('No')}
          </Button>
        </DialogActions>
      </Dialog>
    </CTX.Provider>
  );
}

const RecipesTable = React.memo(() => {
  const { t } = useTranslation();
  const recipes = usePage().props.recipes as Recipes;

  return (
    <TableContainer component={PiwiPaper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell />
            <TableCell align="center">{t('ID')}</TableCell>
            <TableCell align="center">{t('Name')}</TableCell>
            <TableCell align="center">{t('Categories')}</TableCell>
            <TableCell align="center">{t('Cost')}</TableCell>
            <TableCell align="center">{t('Premium')}</TableCell>
            <TableCell align="center">{t('Create at')}</TableCell>
            <TableCell align="center">{t('Set up')}</TableCell>
            <TableCell align="center">{t('Actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recipes.map((recipe) => (
            <RecipeTableRow
              key={`recipe-table-row-${recipe.id}`}
              recipe={recipe}
            />
          ))}
        </TableBody>
        <RecipeTableFooter />
      </Table>
    </TableContainer>
  );
}, _.isEqual);

function RecipeTableRow({
  recipe: {
    id,
    name,
    cover,
    cost,
    premium,
    created_at,
    setup,
    categories,
    preparations,
  },
  ...props
}: TableRowProps & { recipe: Recipe }) {
  const { t } = useTranslation();
  const [collapse, setCollapse] = useState(false);
  const { setDialog, setId } = useContext(CTX);

  const toggle = useCallback(() => setCollapse((prev) => !prev), []);

  return (
    <>
      <TableRow {...props}>
        <TableCell>
          <IconButton onClick={toggle}>
            {!collapse ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <img
            src={`/storage/uploads/${cover}`}
            alt={`/storage/uploads/${cover}`}
            width="64px"
            height="64px"
          />
        </TableCell>
        <TableCell align="center">{id}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>
          {categories.map((category) => category.label).join(', ')}
        </TableCell>
        <TableCell align="center">{premium ? cost : t('No')}</TableCell>
        <TableCell align="center">
          <IconButton>{premium ? <DoneIcon /> : <ClearIcon />}</IconButton>
        </TableCell>
        <TableCell align="center">{created_at}</TableCell>
        <TableCell>
          {setup ? (
            <IconButton
              onClick={() =>
                setDialog({
                  title: t('Setup'),
                  content: setup,
                })
              }
            >
              <FindInPageIcon />
            </IconButton>
          ) : (
            <IconButton>
              <ClearIcon />
            </IconButton>
          )}
        </TableCell>
        <TableCell align="center">
          <IconButton
            LinkComponent={Link}
            href={route('update-recipe', { id })}
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => setId(id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell colSpan={10} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <PreparationsTable collapse={collapse} preparations={preparations} />
        </TableCell>
      </TableRow>
    </>
  );
}

function PreparationsTable({
  collapse,
  preparations,
}: {
  collapse: boolean;
  preparations: Preparation[];
}) {
  const { t } = useTranslation();
  const { setDialog } = useContext(CTX);

  return (
    <Collapse in={collapse} timeout="auto" unmountOnExit>
      <Box sx={{ margin: 1 }}>
        <Typography variant="h6" gutterBottom component="div">
          {t('Preparations')}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">{t('ID')}</TableCell>
              <TableCell align="center">{t('Name')}</TableCell>
              <TableCell align="center">{t('Ingredients')}</TableCell>
              <TableCell align="center">{t('Instructions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {preparations.map(({ id, name, ingredients, instructions }) => (
              <TableRow key={`preparation-table-row-${id}`}>
                <TableCell align="center">{id}</TableCell>
                <TableCell>{name}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() =>
                      setDialog({
                        title: t('Ingredients'),
                        content: (() => {
                          let html =
                            '<ul style="padding: 0; list-style: none;">';
                          ingredients.forEach((piwi, index) => {
                            html += `<li>${index + 1} - ${piwi.weight} gr: ${
                              piwi.name
                            }</li>`;
                          });
                          html += '</ul>';

                          return html;
                        })(),
                      })
                    }
                  >
                    <ListIcon />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() =>
                      setDialog({
                        title: t('Instructions'),
                        content: instructions,
                      })
                    }
                  >
                    <FindInPageIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Collapse>
  );
}

function RecipeTableFooter() {
  const { page, count, rows } = usePage().props;

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]} // , { label: t('All'), value: -1 }
          colSpan={10}
          count={count as number}
          rowsPerPage={rows as number}
          page={page as number}
          onRowsPerPageChange={(ev) =>
            router.get(
              route('recipes', { page, rows: parseInt(ev.target.value, 10) }),
            )
          }
          onPageChange={(ev, newPage) =>
            router.get(route('recipes', { page: newPage, rows }))
          }
        />
      </TableRow>
    </TableFooter>
  );
}

const PiwiPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const Actions = styled.div(({ theme }) => ({
  width: '100%',
  paddingTop: theme.spacing(4),
  display: 'flex',
  justifyContent: 'flex-end',
}));

interface RootDialog {
  title: string;
  content: string;
}

interface CTXProps {
  setDialog: React.Dispatch<React.SetStateAction<RootDialog | null>>;
  setId: React.Dispatch<React.SetStateAction<number>>;
}

type Recipes = Array<Recipe>;

export interface Recipe {
  id: number;
  name: string;
  cover: string;
  cost: string | null;
  premium: boolean;
  created_at: string | null;
  setup: string | null;
  categories: Array<Category>;
  preparations: Array<Preparation>;
}

interface Category {
  id: number;
  label: string;
  slug: string;
}

interface Preparation {
  id: number;
  name: string;
  ingredients: Array<{ name: string; weight: string }>;
  instructions: string;
}
