import React from "react";

type IProps = {
  pageNumber: number;
  totalPages: number;
  ChangePage: (bool: boolean) => void;
};

export default function PagesSelector({
  pageNumber,
  totalPages,
  ChangePage,
}: IProps) {
  return (
    <div className="page-block">
      <button className="btn" onClick={() => ChangePage(false)}>
        prev
      </button>
      <p className="garage-text">
        Page {pageNumber} / {totalPages}
      </p>
      <button className="btn" onClick={() => ChangePage(true)}>
        next
      </button>
    </div>
  );
}
