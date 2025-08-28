import { Icon } from '@iconify/react';
import Image from 'next/image';
import { CategoryResponse } from "@/types/categories";
import { Fetch } from "@/utils/Fetch";
import Link from "next/link";
import WebsiteSchema from "@/components/schema/website";

export default async function footer() {
    const { data: categoryData } = await Fetch<CategoryResponse>("categories");
    const topCategories = categoryData.slice(0, 8);
    return (
        <footer className="bg-primary text-white custom_container  relative">
            <WebsiteSchema />
            <div className='flex justify-start items-start py-10 md:py-20'>
                <div className="container w-full md:w-[80%] mx-auto px-4 flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
                    {/* MegaMart Logo Section */}
                    <div className=''>
                        <h2 className="text-4xl font-bold pb-8">Best Fashion</h2>
                        <div className="mt-4 flex flex-col gap-6">
                            <h3 className="text-xl font-bold ">Contact Us</h3>
                            <div className="text-base">
                                <div className='flex gap-2 pb-2'>
                                    <Icon icon="ic:outline-whatsapp" className="text-2xl" />
                                    <span>WhatsApp</span>
                                </div>
                                <span>+1 (765) 485-1222</span>
                            </div>
                            <div className="text-base">
                                <div className='flex gap-2 pb-2'>
                                    <Icon icon="ic:outline-phone" className="text-2xl" />
                                    <span>Call Us</span>
                                </div>
                                <span>+1 (765) 485-1222</span>
                            </div>

                        </div>
                    </div>

                    {/* Most Popular Categories Section */}
                    <div>
                        <h3 className="text-xl font-bold pb-3 border-b-4 border-white mb-8">Most Popular Categories</h3>
                        <ul className="text-base font-light list-disc list-inside mt-2 space-y-3">
                            {/* <li><Link href={`/${}`} > Staples </Link></li> */}
                            {topCategories.map((category, index) => (
                                <li key={index} >
                                    <Link href={`/${category.slug}`}>
                                        {category.name}
                                    </Link>
                                </li>


                            ))}
                        </ul>
                    </div>

                    {/* Customer Services Section */}
                    <div>
                        <h3 className="text-xl font-bold pb-3 border-b-4 border-white mb-8">Customer Services</h3>
                        <ul className="text-base font-light list-disc list-inside mt-2 space-y-3">
                            <li>About Us</li>
                            <li>Terms & Conditions</li>
                            <li>FAQ</li>
                            <li>Privacy Policy</li>
                            <li>E-waste Policy</li>
                            <li>Cancellation & Return Policy</li>
                        </ul>
                    </div>
                </div>
                <div className='w-[20%] hidden md:flex flex-col justify-center items-center'></div>
                <Image src={"/assets/images/footer.png"} alt="footer" width={321} height={401} className="absolute top-0 right-0 object-cover hidden md:block" />
            </div>
            <div className='border-t-2 border-[#05ABF3] text-center text-lg font-light py-8'>
                <p>© 2025 All rights reserved. SoftTex Solution.</p>
            </div>
        </footer>
    );
};

