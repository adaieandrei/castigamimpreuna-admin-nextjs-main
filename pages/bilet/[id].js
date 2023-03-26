import { useRouter } from 'next/router'
import * as React from 'react'
import { firestoreDB } from '../../firebase'
import { doc, setDoc, collection, getDoc, query, getDocs, where, updateDoc, deleteDoc } from 'firebase/firestore'

const Bilet = ({ ctx }) => {
    const [pid, setPid] = React.useState("")
    const router = useRouter()


    const getFromFB = async (pid) => {
        // console.log(pid)
        const docSnap = await getDoc(doc(firestoreDB, 'generate', pid))

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }




    React.useEffect(async () => {
        if (!router.isReady) return;
        console.log("Router: " + JSON.stringify(router.query.id))
        //console.log("localRouter: " + JSON.stringify(localRouter.query))
        // const pidRoute = router.query
        // const PID = router.query.pid
        // setPid(pidRoute)
        // console.log(pidRoute.pid)
        //console.log("PID: " +pid)  
        getFromFB(router.query.id)
    }, [router.isReady]);
    return (
        <>
        </>
    )
}

export default Bilet