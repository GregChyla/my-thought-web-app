import {useEffect, useState} from "react";
import {ThoughtOverview} from "./AppMain/ThoughtOverview/ThoughtOverview";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {ThoughtCreationArea} from "./AppMain/ThoughtCreationArea/ThoughtCreationArea";
import "./MainPage.css";
import {PageNav} from "./AppMain/PageNav/PageNav";

const MainPage = () => {

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    }
    const query = useQuery();
    const tagSearch = query.get("tag");
    const history = useHistory();
    let {pageNumber} = useParams();

    const baseApiUrl = process.env.REACT_APP_API_BASE;
    const thoughtsPageUrl = "/thoughts/pages/";
    if (isNaN(pageNumber)) {
        pageNumber = 0;
    }
    const [page, setPage] = useState(pageNumber);
    const updateThoughts = () => {
        let finalEndpoint = baseApiUrl + thoughtsPageUrl + page;
        if (tagSearch) {
            finalEndpoint += `?tag=${tagSearch}`;
        }
        fetch(finalEndpoint)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    setThoughts(undefined);
                    throw new Error("Page not found")
                }
            }).then((json) => {
            setThoughts(json);
        })
    }
    const [thoughts, setThoughts] = useState([])
    useEffect(() => {
        updateThoughts();
    }, [tagSearch]);

    useEffect(() => {
        let newUrl = `/pages/${page}`;
        if (tagSearch) {
            newUrl += `?tag=${tagSearch}`;
        }
        history.replace(newUrl);
        window.scrollTo({
            top: 0,
            behavior: "auto"
        });
        updateThoughts();
    }, [page, history, tagSearch]);


    return <div className={"main-page-content"}>
        <ThoughtCreationArea updateThoughts={updateThoughts}/>
        {thoughts ?
            thoughts.map((thought, id) =>
                <ThoughtOverview
                    id={thought.id}
                    content={thought.content}
                    date={thought.postDate}
                    likersProp={thought.likersUsernames}
                    tags={thought.tags}
                    author={thought.authorUsername}
                    key={id}
                />) : <></>}
        <PageNav page={parseInt(page)} setPage={setPage} thoughtsAmount={thoughts.length}/>
    </div>;
}
export
{
    MainPage
}
