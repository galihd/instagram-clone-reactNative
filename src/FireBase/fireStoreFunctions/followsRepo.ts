import { collection, deleteDoc, doc, FirestoreDataConverter, getDocs, query, setDoc, where } from "firebase/firestore";
import { Follow } from "../../types/modeltypes";
import { db } from "../firebaseConfig";
import { findAllUsersByIdArray } from "./usersRepo";




const followsConverter : FirestoreDataConverter<Follow> = {
    fromFirestore : (snapshot,options) => ({...snapshot.data(options),followId : snapshot.id}) as Follow,
    toFirestore : ({followId,...rest}) => rest 
}

export const followCollections = collection(db,'Follows').withConverter(followsConverter);

export const convertFollowingToAppuser = (follows : Follow[]) => findAllUsersByIdArray( follows.map(follow => follow.toUserId) );
export const convertFollowersToAppuser = (follows : Follow[]) => findAllUsersByIdArray( follows.map(follow => follow.fromUserId) );


export const createFollow = async (fromUserId : string,toUserId : string) : Promise<Follow> => {
    const docRef = doc(followCollections);
    const followData : Follow = {
        followId : docRef.id,
        fromUserId : fromUserId,
        toUserId : toUserId
    }
    await setDoc(docRef,followData)
    return followData
}

export const deleteFollow = async (followId : string) => deleteDoc( doc(followCollections,followId) )

export const getUserFollowersByUserId = async (appuserId : string) : Promise<Follow[]> => {
    const qSnap = await getDocs( query(followCollections,where('toUserId','==',appuserId)) );
    return qSnap.docs.map(item => item.data());
}

export const getUserFollowingByUserId = async (appuserId : string) : Promise<Follow[]> => {
    const qSnap = await getDocs( query(followCollections,where('fromUserId','==',appuserId)) );
    return qSnap.docs.map(item => item.data());
}