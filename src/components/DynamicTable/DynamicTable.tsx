import React from 'react';



interface DynamicProps{
    data:any,
    renderButton?: (row:{[key:string]:any})=>React.ReactNode
    attributeLabels:any
}

export const DynamicTable = ({ data, renderButton, attributeLabels }: DynamicProps) => {
    // Extract available keys from the first object in the data array to define table headers
    const availableKeys = data.length > 0 ? Object.keys(data[0]).filter(key => key in attributeLabels) : [];

    return (
        <table className="table table-stripes">
            <thead>
                <tr>
                    {availableKeys.map((key) => (
                        attributeLabels[key] !== 'ID' && <th scope="col" key={key}>{attributeLabels[key] || key}</th>
                    ))}
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item: any, index: any) => (
                    <tr key={index}>
                        {availableKeys.map((key) => (
                            attributeLabels[key] !== 'ID' && (
                                <td key={key}>
                                    {typeof item[key] === 'boolean' ? (item[key] ? 'Yes' : 'No') : item[key]}
                                </td>
                            )
                        ))}
                        {renderButton && <td>{renderButton(item)}</td>}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
