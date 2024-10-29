import { NoDataProps } from "../../types/types"
import './NoData.scss';

export const NoData=(noDataProps:NoDataProps)=>{

    return(
     
<div className="d-flex flex-column justify-content-center"><div className="no-data">{noDataProps.noData}</div><div className="no-data-desc pt-2">{noDataProps.noDataDesc}</div></div>
     
    )
}