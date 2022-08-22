import React, { useEffect } from "react";
import { useForm, FieldValues } from "react-hook-form";
import styles from "./style.module.scss";
import Input from "../../components/Input";
import Button from "../../components/Button";

const minAmountOfFreeCells = 9;

type TProps = {
  onSubmitForm: (data: FieldValues) => void;
};

const Settings = ({ onSubmitForm }: TProps) => {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      width: 10,
      height: 10,
      blackHolesAmount: 8,
    },
  });
  const widthField = watch("width");
  const heightField = watch("height");
  const blackHolesAmountField = watch("blackHolesAmount");

  const onSubmit: any = handleSubmit((data: FieldValues) => {
    onSubmitForm(data);
  });

  useEffect(() => {
    if (heightField && widthField) {
      const diff = +heightField * +widthField - minAmountOfFreeCells;

      if (minAmountOfFreeCells && diff < +blackHolesAmountField) {
        setValue("blackHolesAmount", diff);
      }
    }
  }, [setValue, heightField, widthField, blackHolesAmountField]);

  return (
    <div className={styles.wrap}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.size}>
          <Input
            min={5}
            max={40}
            name="width"
            label="Width"
            onSetValue={setValue}
            register={register}
            isError={!!errors.width}
            required
          />
          <Input
            min={5}
            max={40}
            name="height"
            label="Height"
            onSetValue={setValue}
            register={register}
            isError={!!errors.height}
            required
          />
        </div>

        <div className={styles.blackHoles}>
          <Input
            min={1}
            name="blackHolesAmount"
            label="Black Holes"
            register={register}
            isError={!!errors.blackHolesAmount}
            required
          />
        </div>

        <Button type="submit" color="green">
          Start
        </Button>
      </form>
    </div>
  );
};

export default Settings;
