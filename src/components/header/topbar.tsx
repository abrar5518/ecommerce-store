import { Icon } from '@iconify/react';

export default function topbar() {
    return (
        <div className="bg-sec_bg hidden md:flex justify-between custom_container text-sm text-text py-2">
            <div className="">
                <p>Welcome to Best Fashion!</p>
            </div>
            <div className="flex justify-end">
                <div className="flex flex-row gap-[6px] px-4 border-r-[2px]">
                    <Icon icon="mdi:map-marker-outline" width={24} height={24} className='text-primary' />
                    <p>Deliver to <strong>423651</strong></p>
                </div>
                <div className="flex flex-row gap-[6px] px-4 border-r-[2px]">
                    <Icon icon="iconoir:delivery-truck" width={24} height={24} className='text-primary' />
                    <p>Track your order</p>
                </div>
                <div className="flex flex-row gap-[6px] px-4 border-r-[2px]">
                    <Icon icon="mdi:tag-outline" width={24} height={24} className='text-primary' />
                    <p>All Offers</p>
                </div>
            </div>

        </div>
    )
}