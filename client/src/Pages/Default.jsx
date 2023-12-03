import { useState, useEffect } from 'react'
import axios from 'axios'
import ReactPaginate from "react-paginate";
import { AiFillDelete, AiFillEdit, AiFillSave } from "react-icons/ai";
function Default() {
    const [data, setData] = useState([])
    const [searchUser, setSearchUser] = useState("");


    const [checkedItems, setCheckedItems] = useState([]);


    const handleCheckboxChange = (id) => {
        const currentIndex = checkedItems.indexOf(id);
        const newCheckedItems = [...checkedItems];

        if (currentIndex === -1) {
            newCheckedItems.push(id);
        } else {
            newCheckedItems.splice(currentIndex, 1);
        }
        console.log(newCheckedItems)
        setCheckedItems(newCheckedItems);
    };




    // Pagination Start
    const [pageCount, setPageCount] = useState(0);
    // console.log("Page Count:", pageCount);

    const itemPerPage = 10;
    let pageVisited = pageCount * itemPerPage;

    const totalPages = Math.ceil(data.length / itemPerPage);
    const pageChange = ({ selected }) => {
        setPageCount(selected);
    };

    // pagination end

    async function fetchData() {
        try {
            let response = await axios.get("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");

            const fetchedData = response.data
            console.log(response)
            setData(fetchedData)
        } catch (err) {
            console.log("Eror :", err)
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    // Delete User data onClick
    const deleteUser = (selectedUser) => {
        let userAfterDeletion = data.filter((user) => {
            return user.id !== selectedUser;
        });
        setData(userAfterDeletion);
    };

    // Delete Selected User
    const handleMultipleDelete = () => {
        const updatedData = data.filter(item => !checkedItems.includes(item.id));
        setData(updatedData);
        setCheckedItems([]);
    };



    const handleEdit = (id) => {
        const newData = [...data];
        const index = newData.findIndex((item) => item.id === id);
        newData[index].editMode = true;
        setData(newData);
    };

    const handleSave = (id) => {
        const newData = [...data];
        const index = newData.findIndex((item) => item.id === id);
        newData[index].editMode = false;
        setData(newData);
    };

    const handleChange = (e, id, fieldName) => {
        const { value } = e.target;
        const newData = [...data];
        const index = newData.findIndex((item) => item.id === id);
        newData[index][fieldName] = value;
        setData(newData);
    };





    return (
        <>
            <div className="w-3/4 text-center m-8">
                <input
                    type="text"
                    className="w-3/5 p-2 border rounded-lg focus:outline-none"
                    placeholder="Search..."
                    onChange={(e) => setSearchUser(e.target.value)}
                />


                <button
                    disabled={checkedItems.length === 0}
                    className="px-3 py-2 mt-4 mx-8 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={handleMultipleDelete}
                >

                    {"        "}
                    <AiFillDelete />{" "} Selected {checkedItems.length}
                </button>

            </div>

            <div className="m-8 relative overflow-x-auto ">
                <table className="w-3/4  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 text-justify: content-center flex: justify-center">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3  flex items-center justify-center">

                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                Action
                            </th>


                        </tr>
                    </thead>
                    <tbody>
                        {data
                            //Search Data by Input

                            .filter((data) => {
                                if (searchUser === "") return data;
                                else if (
                                    data.name.includes(searchUser) ||
                                    data.email.includes(searchUser) ||
                                    data.role.includes(searchUser)
                                ) {
                                    return data;
                                }
                            })
                            .slice(pageVisited, pageVisited + itemPerPage)
                            .map((data) => (
                                <tr key={data.id} className={
                                    checkedItems.includes(data.id)
                                        ? 'bg-gray-700 text-white'
                                        : ''
                                }>
                                    <td className="flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 flex items-center justify-center rounded border-gray-300 focus:ring-blue-500 ring-1 px-6 py-3"
                                            checked={checkedItems.includes(data.id)}
                                            onChange={() => handleCheckboxChange(data.id)}
                                        />
                                    </td>


                                    <td className='text-center'>
                                        {data.editMode ? (
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => handleChange(e, data.id, 'name')}
                                            />
                                        ) : (
                                            data.name
                                        )}
                                    </td>
                                    <td className='text-center'>
                                        {data.editMode ? (
                                            <input
                                                type="text"
                                                value={data.email}
                                                onChange={(e) => handleChange(e, data.id, 'email')}
                                            />
                                        ) : (
                                            data.email
                                        )}
                                    </td>
                                    <td className='text-center'>
                                        {data.editMode ? (
                                            <input
                                                type="text"
                                                value={data.role}
                                                onChange={(e) => handleChange(e, data.id, 'role')}
                                            />
                                        ) : (
                                            data.role
                                        )}
                                    </td>
                                    <td className="flex items-center justify-center">
                                        {data.editMode ? (
                                            <button
                                                className='m-2'
                                                onClick={() => handleSave(data.id)}
                                            >
                                                {" "}
                                                <AiFillSave />{" "}
                                            </button>
                                        ) : (
                                            <button className='m-2' onClick={() => handleEdit(data.id)} >
                                                {" "}
                                                <AiFillEdit />{" "}
                                            </button>
                                        )}

                                        <button className='m-2' onClick={() => deleteUser(data.id)}>
                                            {" "}
                                            <AiFillDelete />{" "}
                                        </button>
                                    </td>
                                </tr>
                            ))}



                    </tbody>
                </table>
                <br />
                <br />

                {/* pagination */}
                <ReactPaginate
                    pageCount={totalPages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    previousLabel={'Previous'}
                    nextLabel={'Next'}
                    breakLabel={'...'}
                    containerClassName={'flex items-center justify-center space-x-2 my-2'}
                    previousClassName={'px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200'}
                    nextClassName={'px-4 py-2 rounded-md border border-gray-300 bg-gray-100 text-gray-600 hover:bg-gray-200'}
                    activeClassName={'px-4 py-2 rounded-md border border-blue-500 bg-blue-500 text-white'}
                    breakClassName={'mx-2 text-gray-600'}
                    disabledClassName={'opacity-50 cursor-not-allowed'}
                    renderOnZeroPageCount={null}
                    onPageChange={pageChange}
                />

            </div>
        </>
    );
}
export default Default
