export default function Form() {
  return (
    <div>
      Form
      <form>
        <h1>コースを選択</h1>
        <div className="w-fit">
          <label>
            週1日
            <input type="radio" value={1} name="course" />
          </label>
        </div>
        <div className="w-fit">
          <label>
            週3日
            <input type="radio" value={3} name="course" />
          </label>
        </div>
        <div className="w-fit">
          <label>
            週5日
            <input type="radio" value={5} name="course" />
          </label>
        </div>
      </form>
    </div>
  );
}
