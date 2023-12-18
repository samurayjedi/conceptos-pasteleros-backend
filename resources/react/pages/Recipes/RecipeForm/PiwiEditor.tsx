import React, { useRef } from 'react';
import _ from 'lodash';
import { Editor } from '@tinymce/tinymce-react';

export default function PiwiEditor({ onChange, ...props }: PiwiEditorProps) {
  const ref = useRef<Editor>(null);
  const piwiProps = _.defaults(
    {
      init: {
        skin: 'oxide-dark',
        content_css: 'dark',
        height: 300,
        plugins:
          'mentions autolink charmap emoticons image link lists textcolor searchreplace table visualblocks wordcount checklist mediaembed casechange formatpainter permanentpen advtable fullscreen editimage tableofcontents powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
        toolbar:
          'bold italic underline strikethrough forecolor backcolor align checklist numlist bullist | lineheight indent outdent | link image table emoticons charmap | blocks removeformat fontsize fontfamily undo redo',
        tinycomments_mode: 'embedded',
        tinycomments_author: 'Author name',
        mergetags_list: [
          {
            value: 'First.Name',
            title: 'First Name',
          },
          {
            value: 'Email',
            title: 'Email',
          },
        ],
      },
    },
    props,
  );

  return (
    <Editor
      {...piwiProps}
      tinymceScriptSrc="/storage/tinymce/tinymce.min.js"
      apiKey="kq5c8fvux789ubm44jr6wwl35i96kzrjci9syeigklsy74rt"
      ref={ref}
      onChange={() => {
        if (ref.current && ref.current.editor) {
          onChange({
            target: {
              name: props.textareaName || '',
              value: ref.current.editor.getContent(),
            },
          });
        }
      }}
    />
  );
}

interface PiwiEditorProps
  extends Omit<React.ComponentProps<typeof Editor>, 'onChange' | 'apiKey'> {
  onChange: (ev: PiwiEv) => void;
}

interface PiwiEv {
  target: {
    name: string;
    value: any;
  };
}
