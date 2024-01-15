import { useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';

export default function Cover({ initial }: { initial?: string }) {
  const [piwi, setPiwi] = useState<HTMLLabelElement | null>(null);
  const [image, setImage] = useState(initial);
  const { t } = useTranslation();

  return (
    <InputFileRoot
      ref={(ref) => {
        if (ref !== piwi) {
          setPiwi(ref);
        }
      }}
      label={t('Upload Photo')}
      height={piwi ? piwi.offsetWidth : 100}
      className={clsx({ selected: image && image !== '' })}
      image={image}
    >
      <input
        type="file"
        id="preparation-cover"
        name="cover"
        accept="application/pdf, image/png, image/gif, image/jpeg"
        onChange={(ev) => {
          const { files } = ev.target;
          if (files) {
            const file = files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setImage(reader.result as string);
              };
              reader.readAsDataURL(file);
            }
          }
        }}
      />
    </InputFileRoot>
  );
}

const InputFileRoot = styled.label<{
  label: string;
  height?: number;
  image?: string;
}>(({ theme, label, height = 100, image = '' }) => ({
  width: '100%',
  height,
  borderWidth: 2,
  color: theme.palette.grey[500],
  borderColor: theme.palette.divider,
  borderStyle: 'dotted',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'border-color .2s ease-in, color .2s ease-in',
  '& input[type="file"]': {
    display: 'none',
  },
  ':hover': {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
  },
  ':before': {
    display: 'block',
    content: '"📎"',
    fontSize: 50,
  },
  ':after': {
    display: 'block',
    content: `"${label}"`,
    fontSize: 16,
    fontWeight: 'bold',
  },
  '&.selected': {
    backgroundImage: `url('${image}')`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    '&:before, &:after': {
      display: 'none',
    },
  },
}));
