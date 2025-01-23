import { ChangeEventHandler } from "react";

type RadioButtonArgs = {
  name: string;
  className?: string;
  optionClassName?: string;
  buttons: {
    title: string;
    value: string | number | readonly string[] | undefined;
    checked?: boolean;
  }[];
  required?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

export default function RadioButton(args: RadioButtonArgs) {
  return (
    <div className={args.className}>
      {args.buttons.map((v, i) => (
        <div key={i}>
          <label>
            {v.title}
            <input
              type="radio"
              className={args.optionClassName}
              value={v.value}
              name={args.name}
              defaultChecked={v.checked}
              onChange={args.onChange}
              required={args.required}
            />
          </label>
        </div>
      ))}
    </div>
  );
}
