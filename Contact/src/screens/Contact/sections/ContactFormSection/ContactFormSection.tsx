import React, { useState } from "react";

export const ContactFormSection = (): JSX.Element => {
  const [lastName, setLastName] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  return (
    <div className="flex flex-col w-[600px] items-start gap-4 absolute top-[369px] left-[739px]">
      <label
        htmlFor="lastName"
        className="relative self-stretch mt-[-1.00px] [font-family:'Figtree',Helvetica] font-bold text-black text-2xl tracking-[0] leading-[30px]"
      >
        Last Name
      </label>

      <div className="flex flex-col items-start gap-2.5 p-6 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-xl border border-solid border-[#00000030]">
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={handleInputChange}
          placeholder="Enter here"
          className="relative w-full mt-[-1.00px] [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-[#8d8d8d] text-2xl text-left tracking-[0] leading-[30px] placeholder:text-[#8d8d8d] focus:text-black focus:outline-none bg-transparent"
          aria-label="Last Name"
        />
      </div>
    </div>
  );
};
