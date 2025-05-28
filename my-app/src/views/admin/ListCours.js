import React from "react";

// components

import CardListCours from "components/Cards/CardListCours.js";

export default function ListCours() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-8/12 px-4">
          <CardListCours />
        </div>
        <div className="w-full lg:w-4/12 px-4">
          <CardListCours />
        </div>
      </div>
    </>
  );
}
