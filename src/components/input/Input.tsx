import { ChangeEvent } from "react";
import { hasData } from "../../lib/validation";

interface Props {
  label?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Input = (props: Props) => {
  return (
    <div>
      <label>{hasData(props.label) && `${props.label}`}</label>
      <div>
        <input onChange={props.onChange} />
      </div>
    </div>
  )
}

export default Input
