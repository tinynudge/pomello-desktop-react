import { selectServiceId } from '@/app/appSlice';
import useTranslation from '@/shared/hooks/useTranslation';
import { SelectItem } from '@domain';
import { FC, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from './SelectField.module.scss';

interface SelectFieldProps {
  items: SelectItem[];
  placeholder?: string;
  onChange(optionId: string): void;
}

const SelectField: FC<SelectFieldProps> = ({ items, placeholder: customPlaceholder, onChange }) => {
  const { t } = useTranslation();

  const serviceId = useSelector(selectServiceId);

  const buttonRef = useRef<HTMLButtonElement>(null);

  const placeholder = customPlaceholder ?? t('selectPlaceholder');

  useEffect(() => {
    const removeSelectOptionListener = window.app.onSelectChange(onChange);

    return () => {
      removeSelectOptionListener();
    };
  }, [onChange]);

  useEffect(() => {
    window.app.setSelectItems({ serviceId, placeholder, items });
  }, [placeholder, items, serviceId]);

  const handleButtonClick = () => {
    if (!buttonRef.current) {
      return;
    }

    const bounds = buttonRef.current.getBoundingClientRect();

    window.app.showSelect({
      buttonBounds: {
        height: bounds.height,
        width: bounds.width,
        x: bounds.x,
        y: bounds.y,
      },
    });
  };

  return (
    <button className={styles.button} onClick={handleButtonClick} ref={buttonRef}>
      {placeholder}
    </button>
  );
};

export default SelectField;
