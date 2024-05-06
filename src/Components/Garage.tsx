import React, {useEffect, useRef, useState} from "react";
import Car from "./Car";
import Form from "./Form";

import PagesSelector from "./PagesSelector";
import {Icar, IwinnerObj, IWinner, IWin} from "./Interface";

const carNames = {
  Porshe: ["Panamera", "Cayene", "Boxter", "911"],
  BMW: ["M4", "540i", "X6"],
  Mersedes: ["AMG G55", "GT63 AMG", "CLS"],
  Lada: ["Priora", "Granta", "X-Ray", "2101"],
  Volkswagen: ["Polo GT", "Scirocco", "Golf GTI", "Beetle"],
};

interface IProps {
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  pageNumber: number;
  changeWinners: (id: number, time: number) => void;
  winners: IWin[];
}

export default function MainPage({
  setPageNumber,
  pageNumber,
  changeWinners,
  winners,
}: IProps) {
  const [carsArr, setCarsArr] = useState<Icar[]>([]);
  const [carObj, setCarObj] = useState<Icar>({
    name: "",
    color: "#FFFFFF",
    id: -1,
  });
  const [serverError, setServerError] = useState<boolean>(false);
  const [totalCars, setTotalCars] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [startRace, setStartRace] = useState<boolean>(false);
  const [emptyGarageMessage, setEmptyGarageMessage] = useState<boolean>(false);
  const [winnerData, setWinnerData] = useState<IWinner>({name: "", time: 0});
  const [endRace, setEndRace] = useState<boolean>(false);
  const save = useRef(false);

  const ChangePage = (bool: boolean) => {
    if (bool && totalPages > pageNumber) {
      setPageNumber((pageNumber += 1));
    }
    if (!bool && pageNumber !== 1) {
      setPageNumber((pageNumber -= 1));
    }
  };

  const DeleteCar = (id: number) => {
    fetch(`http://localhost:3000/garage/${id}`, {method: "DELETE"}).then(
      (response) => {
        if (response.status === 200) {
          getCars(pageNumber);
        }
      }
    );
    const index = winners.findIndex((elem) => elem.id === id);
    if (index !== -1) {
      fetch(`http://localhost:3000/winners/${id}`, {method: "DELETE"});
    }
  };

  const getCars = (page: number) => {
    fetch(`http://localhost:3000/garage?_page=${page}&_limit=7`)
      .then<Icar[]>((response) => {
        setServerError(false);
        if (response.headers.get("X-Total-Count") !== null) {
          setTotalCars(Number(response.headers.get("X-Total-Count")));
          if (
            Math.ceil(Number(response.headers.get("X-Total-Count")) / 7) !== 0
          ) {
            setTotalPages(
              Math.ceil(Number(response.headers.get("X-Total-Count")) / 7)
            );
          }
        }
        return response.json();
      })
      .then((data) => {
        if (data.length === 0) {
          ChangePage(false);
        }
        if (data.length === 0 && pageNumber === 1) {
          setEmptyGarageMessage(true);
        } else setEmptyGarageMessage(false);
        setCarsArr(data);
      })
      .catch((error) => {
        setServerError(true);
        throw new Error(error);
      });
  };

  const addCar = (obj: {name: string; color: string}) => {
    fetch("http://localhost:3000/garage", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(obj),
    })
      .then<Icar>((response) => response.json())
      .then(() => {
        getCars(pageNumber);
      });
  };

  //////
  const ChangeCar = (obj: Icar) => {
    localStorage.removeItem("changeInp");
    setCarObj(obj);
    save.current = true;
  };

  const fetchChangedCar = (
    obj: {name: string; color: string},
    id: number | undefined
  ) => {
    fetch(`http://localhost:3000/garage/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(obj),
    })
      .then<Icar>((response) => response.json())
      .then((data) => {
        const arr = [...carsArr];
        const index = arr.findIndex((car) => car.id === data.id);
        arr.splice(index, 1, data);
        setCarsArr(arr);
      });
  };

  const create100Cars = () => {
    for (let i = 0; i < 100; i++) {
      const arr = Object.entries(carNames);
      const firstName = arr[Math.floor(Math.random() * arr.length)];
      const secondName =
        firstName[1][Math.floor(Math.random() * firstName[1].length)];
      const name = `${firstName[0]} ${secondName}`;
      const color = "#" + Math.random().toString(16).slice(3, 9);
      addCar({name, color});
    }
  };

  let winnersArr: IwinnerObj[] = [];
  const createWinner = (obj: Icar, time: number, status: boolean) => {
    winnersArr.push({obj, time, status});
    if (winnersArr.length === carsArr.length) {
      setEndRace(true);
      const winner = winnersArr.find((elem) => elem.status === true);
      if (winner) {
        setWinnerData({name: winner.obj.name, time: winner.time});
        changeWinners(winner.obj.id, winner.time);
        winnersArr = [];
      }
    }
  };

  const stopRace = () => {
    setStartRace(false);
    setEndRace(false);
    setWinnerData({name: "", time: 0});
  };

  useEffect(() => {
    getCars(pageNumber);
    stopRace();
  }, [pageNumber]);

  return (
    <div>
      <Form propFunc={addCar} />
      <Form
        propFunc={fetchChangedCar}
        changeObj={carObj}
        setCarObj={setCarObj}
        save={save.current}
      />
      <div className="btn-block">
        <p className="garage-text">Cars in garage: {totalCars}</p>
        <button
          onClick={() => setStartRace(true)}
          className="btn"
          disabled={startRace}
        >
          Start race
        </button>
        <button onClick={stopRace} className="btn" disabled={!endRace}>
          Reset
        </button>
        <button onClick={create100Cars} className="btn">
          Create 100 cars
        </button>
      </div>
      {carsArr.map((item) => (
        <Car
          carData={item}
          ChangeCar={ChangeCar}
          DeleteCar={DeleteCar}
          getCars={getCars}
          startRace={startRace}
          pageNumber={pageNumber}
          createWinner={createWinner}
          key={item.id}
        />
      ))}
      {emptyGarageMessage && <p>Garage is empty</p>}
      {winnerData.name && (
        <p className="winner-text">
          Winner {winnerData.name} with time {winnerData.time / 1000}s
        </p>
      )}
      <PagesSelector
        pageNumber={pageNumber}
        totalPages={totalPages}
        ChangePage={ChangePage}
      />
      {serverError}
    </div>
  );
}
