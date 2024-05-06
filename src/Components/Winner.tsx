import React, {useEffect} from "react";
import PagesSelector from "./PagesSelector";
import SvgImages from "./SvgImages";
import {Icar, IWin} from "./Interface";

type Iprops = {
  getWinners: Function;
  winners: IWin[];
  winPage: [number, React.Dispatch<React.SetStateAction<number>>];
  sortBy: [
    {
      name: string;
      sort: string;
    },
    React.Dispatch<
      React.SetStateAction<{
        name: string;
        sort: string;
      }>
    >
  ];
  sortOrder: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  totalCars: number;
  totalPages: number;
};
let allCars: Icar[] = [];
export default function WinnersPage({
  getWinners,
  winners,
  winPage,
  sortBy,
  sortOrder,
  totalCars,
  totalPages,
}: Iprops) {
  const ChangePage = (bool: boolean) => {
    if (bool && totalPages > winPage[0]) {
      winPage[1]((winPage[0] += 1));
    }
    if (!bool && winPage[0] !== 1) {
      winPage[1]((winPage[0] -= 1));
    }
  };

  const mixedArr = winners.map((elem) => {
    const car = allCars.find((item) => item.id === elem.id);
    return {
      id: elem.id,
      wins: elem.wins,
      time: elem.time,
      name: car?.name,
      color: car?.color,
    };
  });

  const sortingFn = (by: string) => {
    if (sortOrder[0]) {
      sortBy[1]({name: by, sort: "ASC"});
      sortOrder[1](false);
    } else {
      sortBy[1]({name: by, sort: "DESC"});
      sortOrder[1](true);
    }
  };

  const getGarage = () => {
    fetch("http://localhost:3000/garage")
      .then<Icar[]>((response) => response.json())
      .then((data) => {
        allCars = [...data];
      });
  };

  useEffect(() => {
    getGarage();
  }, []);

  useEffect(() => {
    getWinners(winPage[0], sortBy[0].name, sortBy[0].sort);
  }, [sortBy[0], winPage[0]]);

  return (
    <div className="winner-page">
      <p>Total winners : {totalCars}</p>
      <div className="winners-item">
        <p
          className="winners-item__text clicked"
          onClick={() => sortingFn("id")}
        >
          ID{" "}
          {sortOrder[0] && sortBy[0].name === "id" ? (
            <span>&#8659;</span>
          ) : (
            <span>&#8657;</span>
          )}
        </p>
        <p className="winners-item__text">Name</p>
        <p className="winners-item__text">Car</p>
        <p
          className="winners-item__text clicked"
          onClick={() => sortingFn("wins")}
        >
          Wins{" "}
          {sortOrder[0] && sortBy[0].name === "wins" ? (
            <span>&#8659;</span>
          ) : (
            <span>&#8657;</span>
          )}
        </p>
        <p
          className="winners-item__text clicked"
          onClick={() => sortingFn("time")}
        >
          BestTime{" "}
          {sortOrder[0] && sortBy[0].name === "time" ? (
            <span>&#8659;</span>
          ) : (
            <span>&#8657;</span>
          )}
        </p>
      </div>
      {mixedArr.map((item) => (
        <div key={item.id} className="winners-item">
          <p className="winners-item__text">{item.id}</p>
          <p className="winners-item__text">{item.name}</p>
          <SvgImages
            color={item.color}
            animationTime={0}
            engineBroke={false}
            startEngine={false}
            width={60}
          />
          <p className="winners-item__text">{item.wins}</p>
          <p className="winners-item__text">{item.time}</p>
        </div>
      ))}
      <PagesSelector
        pageNumber={winPage[0]}
        totalPages={totalPages}
        ChangePage={ChangePage}
      />
    </div>
  );
}
