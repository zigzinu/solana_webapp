import React, { FC, useEffect, useState } from 'react';

interface GridInfo {
    imgUrl: string;
    x: string;
    y: string
}

const K3K: FC = () => {

    const [ grids, setGrids ] = useState<GridInfo[]>([]);
    const columns = ["imgUrl", "x", "y"];
    const reload = () => {
        setGrids((prevList) => {
            return [...prevList, {"imgUrl": "sample.png", "x": "111", "y": "222"}];
        });
    }

    return (
        <div>
            <button onClick={reload}>Reload</button>
            <table>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column}>{column}</th>
                        ))} 
                    </tr>
                </thead>
                <tbody>
                    {grids.map(({ imgUrl, x, y}) => (
                        <tr key={x + '-' + y}>
                            <td>{imgUrl}</td>
                            <td>{x}</td>
                            <td>{y}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default K3K;