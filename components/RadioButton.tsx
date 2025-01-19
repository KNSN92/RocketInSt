type RadioButtonArgs = {
  name: string;
  buttons: {
    title: string;
    value: string | number | readonly string[] | undefined;
  }[];
  required?: boolean;
};

export default function RadioButton(args: RadioButtonArgs) {
  return (
    <div>
      {args.buttons.map((v, i) => (
        <div key={i} className="w-fit">
          <label>
            {v.title}
            <input
              type="radio"
              value={v.value}
              name={args.name}
              required={args.required}
            />
          </label>
        </div>
      ))}
    </div>
  );
}
