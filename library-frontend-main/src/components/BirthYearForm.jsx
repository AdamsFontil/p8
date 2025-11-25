import { useMutation } from "@apollo/client/react";
import { useState, useEffect } from "react";
import { UPDATE_BIRTHYEAR } from "../queries";
import Select from "react-select";

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

const BirthYearForm = ({ authors }) => {
  const [birthyear, setBirthYear] = useState("");
  const [changeBirthYear, result] = useMutation(UPDATE_BIRTHYEAR);
  const [name, setName] = useState("");

  const submit = (event) => {
    event.preventDefault();
    console.log("submiting", name, birthyear);
    console.log("what is name", name);
    changeBirthYear({
      variables: { name: name.value, setBornTo: Number(birthyear) },
    });
    setName("");
    setBirthYear("");
    console.log("name at the end", name);
  };

  useEffect(() => {
    console.log("what is result.data", result.data);
    if (result.data && result.data.editNumber === null) {
      console.log("error----person not found");
    }
  }, [result.data]);
  console.log("authors received by birth comp", authors);
  const newOptions = authors.map((a) => ({
    value: a.name,
    label: a.name,
  }));
  console.log("names and options", newOptions, options);
  return (
    <div>
      <h2>Set Birth Year</h2>

      <form onSubmit={submit}>
        <div>
          {/* name{" "}
          <input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
          /> */}
          <Select defaultValue={name} onChange={setName} options={newOptions} />
        </div>
        <div>
          birthyear{" "}
          <input
            type="number"
            value={birthyear}
            onChange={({ target }) => setBirthYear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default BirthYearForm;
