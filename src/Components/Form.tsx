import React, {useEffect, useRef, useState} from "react";
import {Icar} from "./Interface";

interface IProps {
  propFunc: (
    obj: {
      name: string;
      color: string;
    },
    id?: number
  ) => void;
  changeObj?: Icar;
  setCarObj?: React.Dispatch<React.SetStateAction<Icar>>;
  save?: boolean;
}

export default function FormComp({
  propFunc,
  changeObj,
  setCarObj,
  save,
}: IProps) {
  const [carName, setCarName] = useState<string>("");
  const [carColor, setCarColor] = useState<string>("#FFFFFF");
  const [carId, setCarID] = useState<number>(-1);
  const [error, setError] = useState<boolean>(false);
  const color = useRef("#FFFFFF");
  const name = useRef("");
  const id = useRef(-1);

  const SaveToLS = () => {
    const obj = {
      carColor: color.current,
      carName: name.current,
      carId: id.current,
    };
    if (changeObj !== undefined) {
      localStorage.setItem("changeInp", JSON.stringify(obj));
    } else {
      localStorage.setItem("createInp", JSON.stringify(obj));
    }
  };

  const DeleteLs = () => {
    if (changeObj !== undefined) {
      localStorage.removeItem("changeInp");
    } else {
      localStorage.removeItem("createInp");
    }
  };

  const validateData = () => {
    if (changeObj !== undefined) {
      propFunc({name: carName, color: carColor}, carId);
    } else {
      if (carName !== "") {
        propFunc({name: carName, color: carColor});
        setError(false);
      } else setError(true);
    }
    setCarName("");
    setCarColor("#FFFFFF");
    setCarID(-1);
    if (setCarObj !== undefined) {
      setCarObj({name: "", id: -1, color: "#FFFFFF"});
    }
  };

  useEffect(() => {
    if (changeObj !== undefined) {
      setCarName(changeObj.name);
      setCarColor(changeObj.color);
      setCarID(changeObj.id);
      id.current = changeObj.id;
      name.current = changeObj.name;
      color.current = changeObj.color;
      if (localStorage.getItem("changeInp")) {
        const data = JSON.parse(localStorage.getItem("changeInp") as string);
        setCarColor(data.carColor);
        setCarName(data.carName);
      }
    } else {
      if (localStorage.getItem("createInp")) {
        const data = JSON.parse(localStorage.getItem("createInp") as string);
        setCarColor(data.carColor);
        setCarName(data.carName);
      }
    }
    // eslint-disable-next-line
  }, [changeObj]);

  useEffect(() => {
    if (save) {
      SaveToLS();
    }
    // eslint-disable-next-line
  }, [save]);

  return (
    <form className="create-block">
      <input
        type="text"
        className="create-block__input"
        placeholder={changeObj ? "Change Car" : "Car Name"}
        value={carName}
        onChange={(e) => {
          setCarName(e.target.value);
          setError(false);
          name.current = e.target.value;
          SaveToLS();
        }}
        style={{boxShadow: error ? "0 0 5px 5px red" : undefined}}
      />
      {error && <p className="create-block__error">!</p>}
      <input
        type="color"
        className="create-block__input"
        value={carColor}
        onChange={(e) => {
          setCarColor(e.target.value);
          color.current = e.target.value;
          SaveToLS();
        }}
      />
      <button
        type="button"
        className="btn"
        disabled={
          changeObj !== undefined
            ? carName !== "" && changeObj.id !== -1
              ? false
              : true
            : false
        }
        onClick={() => {
          validateData();
          DeleteLs();
        }}
      >
        {changeObj ? "Change" : "Create"}
      </button>
    </form>
  );
}
