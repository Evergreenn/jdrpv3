import React, { useEffect, useState } from "react";
import ReactPaginate from 'react-paginate';
import useApiGet from "../ApiCrawler/get"
import Loader from "./loader"


const Pagination = ({ handleClick, handleRemoveClick }) => {

    const { getData } = useApiGet();
    const [currentItems, setCurrentItems] = useState(null);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [loader, setLoader] = useState(false)
    const [totalGames, setTotalGames] = useState(0)

    useEffect(async () => {

        const response = await getData("api/get-user-game-counted");
        setTotalGames(response.success)
        const test = parseInt(Math.ceil(response.success) / 5);
        setPageCount(test);

        // setLoader(true)

    }, [loader])


    useEffect(async () => {

        const response = await getData("api/get-user-game?page=" + parseInt(page));

        if (response.success.length === 0) {
            setPage(page);

        } else if (response.success) {
            setCurrentItems(response.success);
            setLoader(true)
        }

    }, [page, loader]);

    const onHandleClick = slug => {
        handleClick(slug)
    }

    const onHandleRemoveClick = slug => {
        setLoader(false)
        setPage(1)
        handleRemoveClick(slug)
    }


    const handlePageClick = (event) => {

        setPage(parseInt(event.selected) + 1)
    };


    const Items = ({ currentItems }) => {

        return (
            <>
            {totalGames}
                {currentItems && currentItems
                    .map((data, idx) =>
                        <div className="row">
                            <div className="col ">
                                <div className="card">
                                    <table>
                                        <tr key={idx}>
                                            <td className="text-center">{data.game_name}</td>
                                            <td className="text-center">{data.game_type}</td>
                                            <td className="text-center">{data.created_at}</td>
                                            <td className="text-center">
                                                <a className="button primary" onClick={() => onHandleClick(data.slug)}> Launch</a>
                                                {/* <a className="button primary"> Launch</a> */}
                                                <a className="button error" onClick={() => onHandleRemoveClick(data.game_id)}> Delete</a>
                                                {/* <a className="button error" > Delete</a> */}
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )
                }
            </>
        );
    }


    return (
        <>

            {/* {!loader &&
                <Loader />
            } */}

            {loader &&
                <><Items currentItems={currentItems} />
                    <div className="row is-center">

                        <ReactPaginate
                            breakLabel="..."
                            nextLabel="❯"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={2}
                            marginPagesDisplayed={2}
                            pageCount={pageCount}
                            previousLabel="❮"
                            className="pagination"
                            activeLinkClassName="pagination-active"
                            pageLinkClassName="pagination-a"
                            previousLinkClassName="pagination-a"
                            nextLinkClassName="pagination-a"
                            breakLinkClassName="pagination-a"
                            disabledLinkClassName="pagination-caret-disabled"
                            // pageClassName=""
                            renderOnZeroPageCount={null}
                        />
                    </div>
                    
                </>
            }
        </>
    );

}

export default Pagination