import Form from "next/form";
import SearchFormReset from "./SearchFormReset";

export default function Page() {
  const querry = "Test";

  const reset = () => {
    const form = document.querySelector(".search-form") as HTMLFormElement;

    if (form) form.reset();
  };
  return (
    <Form action="/search" scroll={false}>
      {/* On submission, the input value will be appended to 
          the URL, e.g. /search?query=abc */}
      <input
        name="query"
        defaultValue=""
        className="search-input bg-white/90 rounded-lg px-3 py-2 w-full text-black"
        placeholder="Vyhledat pacienta"
      />
      <div className="flex gap-2">{querry && <SearchFormReset />}</div>
    </Form>
  );
}
