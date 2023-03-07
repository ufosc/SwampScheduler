import { TextField } from "@mui/material";
import React from "react";
import { useState } from "react";

export default function Test() {
  const [bob, setBob] = useState("big bob");

  const handleInput = (e: any) => {
    setBob(e.target.value);
  }

  return (
    <>
    <div>
      {bob}
    </div>

    <TextField value={bob} onChange={handleInput} />
    </>

  );
}