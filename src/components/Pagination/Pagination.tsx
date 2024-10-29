import React from 'react';
import './Pagination.scss';
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

type PaginationProps = {
    count: number;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (pageNumber: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({ count, currentPage, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(count / itemsPerPage);

    const maxDisplayedPages = 5; // Maximum number of pages to be displayed
    const showEllipsis = totalPages > maxDisplayedPages;

    let pageNumbers: (number | string)[] = [];

    if (showEllipsis) {
        const firstPage = 1;
        const secondPage = 2;
        const secondLastPage = totalPages - 1;

        if (currentPage <= secondPage) {
            pageNumbers = [1, 2, 3, 4, 5, '...', totalPages];
        } else if (currentPage >= secondLastPage) {
            pageNumbers = [1, '...', secondLastPage - 2, secondLastPage - 1, secondLastPage, totalPages];
        } else {
            pageNumbers = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    } else {
        pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const handleEllipsisClick = (pageNumber: number | string) => {
        
        if (typeof pageNumber === 'number') {
            onPageChange(pageNumber);
        } else if (pageNumber === '...') {
            if (currentPage <= 2) {
                onPageChange(totalPages);
            } else if (currentPage >= totalPages - 1) {
                onPageChange(1);
            }
        }
    };

    return (
        <div className='row mt-4 mb-4'>
            <div className='col-4'>
                <button
                    className='left_p'
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    style={{ display: currentPage === 1 ? 'none' : 'block' }}
                >
                    <span className='icon_ex'><FiArrowLeft /></span> Previous
                </button>
            </div>
            <div className='col-4 page_c'>
                {pageNumbers.map((pageNum, index) => (
                    <button
                        className={`center_p ${pageNum === currentPage ? ' active' : ' active2'}`}
                        key={index}
                        onClick={() => handleEllipsisClick(pageNum)}
                        disabled={currentPage === pageNum || typeof pageNum !== 'number'}
                    >
                        {pageNum}
                    </button>
                ))}
            </div>
            <div className='col-4'>
                <button
                    className='right_p'
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => onPageChange(currentPage + 1)}
                    style={{ display: currentPage === totalPages ? 'none' : 'block' }}
                >
                    Next <span className='icon_ex'><FiArrowRight /></span>
                </button>
            </div>
        </div>
    );
};

export default Pagination;