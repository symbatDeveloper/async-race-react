import React, {useEffect, useState} from "react";
import {Routes, Route, useNavigate} from "react-router-dom";
import {IWin} from "./Components/Interface";
import "./App.css";
import Garage from "./Components/Garage";
import Winner from "./Components/Winner";

function App() {
  const navigate = useNavigate();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [winners, setWinners] = useState<IWin[]>([]);
  const winPage = useState<number>(1);
  const sortBy = useState<{name: string; sort: string}>({
    name: "id",
    sort: "ASC",
  });
  const sortOrder = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCars, setTotalCars] = useState<number>(0);

  const changeWinners = (id: number, time: number) => {
    const ifWinner = winners.find((elem) => elem.id === id);
    if (ifWinner) {
      ifWinner.wins += 1;
      if (time / 1000 < ifWinner.time) {
        ifWinner.time = time / 1000;
      }
      updateWinner({time: ifWinner.time, wins: ifWinner.wins}, ifWinner.id);
    } else {
      setWinner({id: id, wins: 1, time: time / 1000});
    }
  };

  const setWinner = (obj: IWin) => {
    fetch("http://localhost:3000/winners", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(obj),
    }).then<IWin>((response) => response.json());
  };

  const updateWinner = (obj: {wins: number; time: number}, id: number) => {
    fetch(`http://localhost:3000/winners/${id}`, {
      method: "PUT",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(obj),
    });
  };

  const getWinners = (page?: number, sort?: string, order?: string) => {
    let queryParams = "";
    if (page) {
      queryParams = `?_page=${page}&_limit=10&_sort=${sort}&_order=${order}`;
    }
    fetch(`http://localhost:3000/winners${queryParams}`)
      .then<IWin[]>((response) => {
        if (response.headers.get("X-Total-Count") !== null) {
          setTotalCars(Number(response.headers.get("X-Total-Count")));
          if (
            Math.ceil(Number(response.headers.get("X-Total-Count")) / 10) !== 0
          ) {
            setTotalPages(
              Math.ceil(Number(response.headers.get("X-Total-Count")) / 10)
            );
          }
        }
        return response.json();
      })
      .then((data) => {
        setWinners(data);
      })
      .catch((error) => {
        throw error;
      });
  };

  useEffect(() => {
    getWinners();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => navigate("/")} className="btn">
          Garage
        </button>
        <button onClick={() => navigate("/winners")} className="btn">
          Winner
        </button>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <Garage
              pageNumber={pageNumber}
              setPageNumber={setPageNumber}
              changeWinners={changeWinners}
              winners={winners}
            />
          }
        />
        <Route
          path="/winners"
          element={
            <Winner
              getWinners={getWinners}
              winners={winners}
              winPage={winPage}
              sortBy={sortBy}
              sortOrder={sortOrder}
              totalPages={totalPages}
              totalCars={totalCars}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
