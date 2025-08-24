import React, { useState } from "react";

export const EmailInfoSection = (): JSX.Element => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  return (
    <div className="flex flex-col w-[600px] items-start gap-4 absolute top-[538px] left-[739px]">
      <label
        htmlFor="phone-number-input"
        className="relative self-stretch mt-[-1.00px] [font-family:'Figtree',Helvetica] font-bold text-black text-2xl tracking-[0] leading-[30px]"
      >
        Phone Number *
      </label>

      <div className="flex flex-col items-start gap-2.5 p-6 relative self-stretch w-full flex-[0_0_auto] bg-white rounded-xl border border-solid border-[#00000030]">
        <input
          id="phone-number-input"
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          placeholder="Enter here"
          className="relative w-full mt-[-1.00px] [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-[#8d8d8d] text-2xl text-left tracking-[0] leading-[30px] placeholder:text-[#8d8d8d] focus:text-black focus:outline-none"
          aria-required="true"
          aria-describedby="phone-number-error"
        />
      </div>
    </div>
  );
};
