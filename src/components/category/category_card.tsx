import Image from "next/image"
import Link from "next/link"
import { CategoryCardType } from "@/types/category_card"
const BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL as string

export default function CategoryCard({ slug, name, image, alt }: CategoryCardType) {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <Link href={`/${slug}`} className="flex flex-col items-center justify-center w-full h-full">
                <Image
                    src={BASE_URL+image}
                    alt={alt}
                    width={132}
                    height={132}
                    className="object-cover w-[60px] md:w-[122px]  h-[60px]  md:h-[122px] rounded-full border hover:border-2 hover:border-primary transition-all ease-in-out hover:shadow-md"
                />
                <h2 className="mt-4 text-sm md:text-lg font-medium text-[#222222]">{name}</h2>
            </Link>
        </div>
    )
}