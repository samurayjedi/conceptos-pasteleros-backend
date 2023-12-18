import { useCallback } from 'react';
import _ from 'lodash';
import { router } from '@inertiajs/react';
import { FormProps } from 'react-final-form';

export default function useOnSubmit(action: string) {
  const onSubmit = useCallback<FormProps['onSubmit']>(
    (data) => {
      const formData = new FormData();
      function appendToFormData(value: any, key: string) {
        if (Array.isArray(value) || typeof value === 'object') {
          _.forEach(value, (v, index) => {
            const k = `${key}[${index}]`;
            if (Array.isArray(v) || typeof v === 'object') {
              appendToFormData(v, k);
            } else {
              formData.append(k, v);
            }
          });
        } else {
          formData.append(key, value);
        }
      }

      _.forEach(data, (value: any, key) => {
        /** if the key is a input type file name, append the files selected */
        if (typeof value === 'string') {
          const fields = document.getElementsByName(key);
          const el: HTMLInputElement | null = fields[0] as HTMLInputElement;
          if (el && el.files) {
            const isMultiple = el.hasAttribute('multiple');
            if (isMultiple) {
              for (let i = 0; i < el.files.length; i++) {
                formData.append(`${key}[]`, el.files[i]);
              }
            } else {
              formData.append(key, el.files[0]);
            }

            return;
          }
        }
        /** otherwise, append normally */
        appendToFormData(value, key);
      });

      router.post(action, formData, {
        forceFormData: true,
        onBefore: () => router.remember(data),
      });
    },
    [action],
  );

  return onSubmit;
}
