import React from 'react';
import { CiMail } from 'react-icons/ci';
import { FiCopy } from 'react-icons/fi';
import { CgEnter } from 'react-icons/cg';
import { RiSendPlaneFill } from 'react-icons/ri';

import { inter } from '@/lib/font';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function Page() {
  return (
    <div className="flex justify-center items-center  py-10">
      <div className="flex flex-col md:h-[650px]  md:w-[1000px] h-[500px] w-[300px] border bg-card rounded-2xl">

        <div className="flex justify-between items-center px-8 py-2 h-24 border-b">

          <div className="flex items-center gap-4">
            <div className="flex justify-center items-center bg-gray-50/[.10] rounded-lg md:h-9 md:w-9 h-4 w-4">
              <CiMail />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className={`${inter} text-xs`}>Group Name</div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>#</span>
                <span>PPK554PQ</span>
                <div className="flex justify-center items-center h-4 w-3">
                  <FiCopy />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="border h-6 min-w-20 flex justify-center items-center rounded-lg">
              <h1 className={`text-xs ${inter}`}>
                <span>You: </span> Niyaf
              </h1>
            </div>

            <div className="flex items-center gap-1 px-3 py-2 h-8 bg-card border hover:bg-gray-50/[.10] rounded-lg cursor-pointer">
              <CgEnter />
              <h1 className="text-xs font-medium">Leave</h1>
            </div>
          </div>
        </div>

     
        <div className="h-[470px] flex flex-col border-b py-4 px-2 overflow-y-auto gap-2">
          <Button className="w-fit max-w-[60%] rounded-xl px-4 py-2 text-left">Hello</Button>
          <Button className="w-fit max-w-[60%] rounded-xl px-4 py-2 text-left">How are you?</Button>
          <Button className="w-fit max-w-[60%] rounded-xl px-4 py-2 text-left">Im fine</Button>
        </div>

       
        <div className="px-4 py-8">
          <div className="flex justify-between items-center gap-4">
            <Input className="h-8" placeholder="Type your messages..." />
            <div className="flex items-center justify-center bg-gray-50/[.10] h-10 w-10 rounded-lg">
              <RiSendPlaneFill />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Page;
