import * as React from "react";
import { memo, useState } from "react";
import { ITextFieldStyles, TextField } from "office-ui-fabric-react";

interface IEditTextProps {
  value: string;
  editable?: boolean;
  onChange?: (newValue: string) => void;
  width?: number;
  placeholder?: string;
}
const defaultProps: IEditTextProps = {
  editable: false,
  value: "",
  width: 60,
};

export default memo(function EditableText(
  props: IEditTextProps = defaultProps
) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [textValue, setTextValue] = useState(props.value);
  const narrowTextFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: { width: props.width },
  };
  const handleOnBlur = (): void => {
    setIsEditMode(false);
  };
  const handleKeydown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter") {
      if (props.onChange) props.onChange(textValue);
      handleOnBlur();
    }
  };

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => setTextValue(newValue);

  return isEditMode && props.editable ? (
    <TextField
      label=""
      autoFocus={true}
      value={textValue}
      onChange={handleChange}
      onKeyDown={(e) => handleKeydown(e)}
      onBlur={handleOnBlur}
      styles={narrowTextFieldStyles}
      placeholder={props.placeholder || ""}
    />
  ) : (
    <div
      style={{ display: "flex", alignItems: "center", height: "32px" }}
      onClick={() => props.editable && setIsEditMode(true)}
    >
      {textValue}
    </div>
  );
});
