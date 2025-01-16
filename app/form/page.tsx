import RadioButton from "@/components/RadioButton";
import { ROW, COL, table } from "@/lib/schedule";

export default function Form() {
  return (
    <div>
      Form
      <form>
        <h1>コースを選択</h1>
        <RadioButton name="course"
          buttons={[
            { title: "週1日", value: 1 },
            { title: "週3日", value: 3 },
            { title: "週5日", value: 5 },
          ]}
        />
        <table>
          <thead>
            <tr>
              <th></th>
              {
                ROW.map((row, i) => (
                  <th key={i}>{row}</th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {COL.map((c, i) => (
              <tr key={i}>
                <th>{c}</th>
                {ROW.map((r, j) => (
                  <td key={j}>
                    <select className="w-full bg-black text-white">
                      <option>選択</option>
                      {table[j][i].map((field, i) => (
                        <option key={i}>{field.title}</option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </div>
  );
}
