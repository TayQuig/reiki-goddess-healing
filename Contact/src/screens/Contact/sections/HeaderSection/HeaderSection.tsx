import React, { useState } from "react";

export const HeaderSection = (): JSX.Element => {
  const [firstName, setFirstName] = useState("");

  return (
    <div className="flex flex-col w-[600px] items-start gap-4 absolute top-[369px] left-[98px]">
      <label
        htmlFor="firstName"
        className="relative self-stretch mt-[-1.00px] [font-family:'Figtree',Helvetica] font-bold text-black text-2xl tracking-[0] leading-[30px]"
      >
        First Name *
      </label>

      <div className="flex flex-col items-start gap-2.5 p-6 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-xl border border-solid border-[#00000030]">
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter here"
          className="relative w-full mt-[-1.00px] [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-[#8d8d8d] text-2xl tracking-[0] leading-[30px] placeholder:text-[#8d8d8d] focus:text-black"
          required
          aria-required="true"
        />
      </div>
    </div>
  );
};
