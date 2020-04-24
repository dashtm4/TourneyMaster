import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { ISelectOption } from 'common/models';
import styles from './style.module.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  })
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null,
};

interface Props {
  options: ISelectOption[];
  label?: string;
  value: string[];
  width?: string;
  primaryValue?: string;
  onChange: (values: string[] | null) => void;
}

const SelectMultiple = ({
  options,
  label,
  value,
  onChange,
  primaryValue,
}: Props) => {
  const classes = useStyles();

  const handleChange = ({
    target: { value },
  }: React.ChangeEvent<{ value: unknown }>) => {
    const values = value as string[];

    console.log(values, primaryValue);

    if (primaryValue && values.includes(primaryValue)) {
      onChange([primaryValue]);
    } else {
      const valuesWithOutPrimary = values.filter(it => it !== primaryValue);

      onChange(valuesWithOutPrimary);
    }
  };

  const checkedLabel = options.reduce(
    (acc, it) =>
      value.includes(it.value.toString()) ? [...acc, it.label] : acc,
    [] as string[]
  );

  return (
    <div className={styles.container}>
      <FormControl className={classes.formControl}>
        <span className={styles.label}>{label}</span>
        <Select
          multiple
          value={value}
          onChange={handleChange}
          renderValue={() => checkedLabel.join(', ')}
          MenuProps={MenuProps}
        >
          {options.map((option, idx) => (
            <MenuItem key={idx} value={option.value}>
              <Checkbox checked={value.includes(option.value.toString())} />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectMultiple;
