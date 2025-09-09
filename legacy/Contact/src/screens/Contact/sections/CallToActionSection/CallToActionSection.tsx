import React, { useState } from "react";

export const CallToActionSection = (): JSX.Element => {
  const [message, setMessage] = useState("");

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  return (
    <div className="flex flex-col w-[1241px] items-start gap-4 absolute top-0 left-[98px]">
      <label
        htmlFor="message-textarea"
        className="relative self-stretch mt-[-1.00px] [font-family:'Figtree',Helvetica] font-bold text-black text-2xl tracking-[0] leading-[30px]"
      >
        Message *
      </label>

      <div className="flex flex-col h-[138px] items-start gap-2.5 p-6 relative self-stretch w-full bg-white rounded-xl border border-solid border-[#00000030]">
        <textarea
          id="message-textarea"
          value={message}
          onChange={handleMessageChange}
          placeholder="write your message here"
          className="relative w-full h-full resize-none mt-[-1.00px] [font-family:'Neue_Montreal-Regular',Helvetica] font-normal text-[#8d8d8d] text-2xl tracking-[0] leading-[30px] placeholder:text-[#8d8d8d] focus:text-black focus:outline-none"
          aria-required="true"
          aria-label="Message"
        />
      </div>
    </div>
  );
};
