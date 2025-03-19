import FinanceLog from './../../public/logo.png';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
      className="h-12 w-12 bg-white rounded-full bg-blend-multiply" 
      src={FinanceLog}
      width={62}
      height={62}
      alt="Finance Logo" 
      />
     
    </div>
  );
}
