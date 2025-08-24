import React, { useState } from "react";

export const PhoneInfoSection = (): JSX.Element => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className="flex flex-col w-[600px] items-start gap-4 absolute top-[538px] left-[98px]">
      <label
        htmlFor="email-input"
        className="relative self-stretch mt-[-1.00px] [font-family:'Figtree',Helvetica] font-bold text-black text-2xl tracking-[0] leading-[30px]"
      >
        Email *
      </label>

      <div className="flex flex-col items-start gap-2.5 p-6 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-xl border border-solid border-[#00000030]">
        <input
          id="email-input"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter here"
          required
          aria-required="true"
          className="relative w-full mt-[-1.00px] [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-[#8d8d8d] text-2xl text-left tracking-[0] leading-[30px] placeholder:text-[#8d8d8d] focus:text-black focus:outline-none"
        />
      </div>
    </div>
  );
};
