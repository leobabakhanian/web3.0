import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from 'react-icons/bi';
import { RiHeart2Fill } from 'react-icons/ri';

const ServiceCard = ({color, title, icon, subtitle}) => (
    <div className="flex flex-row justify-center items-center white-glass p-4 m-2 cursor-pointer hover:shadow-xl">
        <div className={`mx-5 w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
            {icon}
        </div>
        <div className="ml-5 flex flex-col flex-1">
            <h1 className="mt-2 text-white text-lg">{title}</h1>
            <p className="mt-2 text-white text-sm md:w-11/12 pb-3">{subtitle}</p>
        </div>
    </div>
)

const Services = () => {
    return (
        <div className="flex flex-col md:flex-row w-full justify-center items-center gradient-bg-services">
            <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
                <div className="flex-1 flex flex-col justify-start items-start mf:mr-20">
                    <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient">
                        Services that are<br /> important to us <span className="font-bold">most</span>
                    </h1>
                </div>
                <div className="flex-1 flex flex-col justify-start items-center">
                    <ServiceCard 
                        color="bg-[#2952E3]"
                        title="Secure Service"
                        icon={<BsShieldFillCheck fontSize={21} className="text-white" />}
                        subtitle="Security is guaranteed when using LCrypt. Your privacy is important to us."
                    />
                    <ServiceCard 
                        color="bg-[#8945F8]"
                        title="Best Exchange Rates"
                        icon={<BiSearchAlt fontSize={21} className="text-white" />}
                        subtitle="We have the best exchange rates on the market. You won't have to worry about
                            high fees!"
                    />
                    <ServiceCard 
                        color="bg-[#F84550]"
                        title="Fast Transactions"
                        icon={<RiHeart2Fill fontSize={21} className="text-white" />}
                        subtitle="Send and receive ethereum in seconds using our service, no more waiting!"
                    />
                </div>
            </div>
        </div>
    );
}

export default Services;