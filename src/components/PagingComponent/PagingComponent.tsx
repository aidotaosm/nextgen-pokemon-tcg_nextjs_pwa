import { useState } from "react";

export const PagingComponent = (paramPageIndex: number = 0, paramPageSize: number = 10) => {
    const [pageIndex, setPageIndex] = useState<number>(paramPageIndex);
    const [pageSize, setpageSize] = useState<number>(paramPageSize);
    const cardsPagingOnClick = (paramPageIndex: number) => {
        console.log(paramPageIndex);
    }
    return (<div className="d-flex justify-content-between align-items-center">
        <div>
            Showing 11 to 20 of {pageSize} entries
        </div>
        <nav aria-label="Page navigation example">
            <ul className="pagination mb-0 justify-content-center">
                <li className="page-item cursor-pointer disabled">
                    <span className="page-link" tabIndex={-1} onClick={() => cardsPagingOnClick(pageIndex - 1)}>Previous</span>
                </li>
                <li className="page-item cursor-pointer"><span className="page-link" onClick={() => cardsPagingOnClick(1)}>1</span></li>
                <li className="page-item" style={{ padding: '0.375rem 0.75rem' }}>of</li>
                <li className="page-item cursor-pointer"><span className="page-link" onClick={() => cardsPagingOnClick(3)}>3</span></li>
                <li className="page-item cursor-pointer">
                    <span className="page-link" onClick={() => cardsPagingOnClick(pageIndex + 1)}>Next</span>
                </li>
            </ul>
        </nav>
    </div>);
}