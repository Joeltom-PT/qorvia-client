import { Calendar, Clock } from 'lucide-react';
import { IOnlineEventTicket } from '../../interfaces/event';
import { Link } from 'react-router-dom';
import { Base64 } from 'js-base64';


interface EventRegistrationHeroProps {
  eventId: string;
  title: string;
  date: string;
  time: string;
  isOnline: boolean;
  duration: string;
  imageUrl: string;
  onlineEventTicket: IOnlineEventTicket;
}

export default function EventRegistrationHero({ eventId, title, date, time, duration, imageUrl, isOnline, onlineEventTicket }: EventRegistrationHeroProps) {
  
  let effectivePrice = onlineEventTicket.price;

  if (onlineEventTicket.hasEarlyBirdDiscount) {
    if (onlineEventTicket.discountType === 'percentage') {
      effectivePrice -= (onlineEventTicket.price * onlineEventTicket.discountValue) / 100;
    } else if (onlineEventTicket.discountType === 'fixed') {
      effectivePrice -= onlineEventTicket.discountValue;
    }
  }



  const encryptedParams = Base64.encode(JSON.stringify({ eventId, isOnline }));

  return (
    <div className="relative h-[60vh] md:h-[95vh] w-10/12 overflow-hidden rounded-xl shadow-xl transition-shadow hover:shadow-2xl">
      <div 
        className="absolute inset-0 bg-cover bg-center transform transition-all duration-500"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          perspective: '1000px',
        }}
      >
        <div className="absolute inset-0 transform hover:scale-105 hover:rotate-3d" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 transition-transform duration-500 text-white backdrop-filter bg-gradient-to-t from-blue-900/100">
        <h1 className="text-2xl md:text-5xl font-extrabold mb-4 drop-shadow-md">{title}</h1>
        <div className="flex flex-col text-white font-semibold md:flex-row gap-4 text-sm md:text-base mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-6 h-6" />
            <span>{time} | {duration}</span>
          </div>
        </div>
          <Link
          to={`/event/confirmation/${encryptedParams}`}
          className="bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-2 px-4 rounded-[5px] shadow-md transition-colors"
        >
          {onlineEventTicket.freeEvent ? "Register" : `Pay only $${effectivePrice.toFixed(2)}`}
        </Link>
      </div>
    </div>
  );
}
