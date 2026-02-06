import { useSearchParams } from "react-router"

export const AssociatesPage = () => {
    const [refCode] =  useSearchParams()
  
  return (
    <div>AssociatePage
        <h1>

        Your ref code is {refCode.get('ref')}
        </h1>
    </div>
  )
}
