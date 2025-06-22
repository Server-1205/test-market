"use client"

import DOMPurify from 'dompurify';
import {useEffect, useState} from "react";


export const Review = ({ reviews }) => {
    const [localReviews, setLocalReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (reviews) {
            const sanitizedReviews = reviews.map(review => ({
                ...review,
                sanitizedText: DOMPurify.sanitize(review.text)
            }));
            setLocalReviews(sanitizedReviews);
        }
    }, [reviews]);

    useEffect(() => {
        if (localReviews.length > 0) {
            setIsLoading(false)
        }
    }, [localReviews])

    return (
        <div className='flex flex-col sm:flex-row gap-5 w-full justify-center'>
            {isLoading ? (
                <>
                    <div className='flex flex-col justify-start items-start bg-[#D9D9D9] rounded-2xl w-full min-h-[611px] max-w-[468px] px-3 py-5 md:pb-8 gap-3 animate-pulse'>
                        <div className='h-6 bg-gray-300 rounded w-3/4 mb-2'></div>
                        <div className='h-6 bg-gray-300 rounded w-2/3 mb-2'></div>
                        <div className='h-6 bg-gray-300 rounded w-1/2'></div>
                    </div>
                    <div className='flex flex-col justify-start items-start bg-[#D9D9D9] rounded-2xl w-full min-h-[611px] max-w-[468px] px-3 py-5 md:pb-8 gap-3 animate-pulse'>
                        <div className='h-6 bg-gray-300 rounded w-3/4 mb-2'></div>
                        <div className='h-6 bg-gray-300 rounded w-2/3 mb-2'></div>
                        <div className='h-6 bg-gray-300 rounded w-1/2'></div>
                    </div>
                </>
            ) : (
                localReviews.map((review, index) => (
                    <div key={index} className='flex flex-col justify-start mx-auto sm:mx-0 items-start bg-[#D9D9D9] rounded-2xl w-full min-h-[611px] max-w-[468px] px-3 py-5 md:pb-8 gap-3'>
                        <div dangerouslySetInnerHTML={{__html: review.sanitizedText}} className='text-center sm:text-left text-black text-xl'/>
                    </div>
                ))
            )}


        </div>
    );
}
