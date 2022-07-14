
import { getDoc,doc, setDoc, query, where, getDocs, updateDoc, FirestoreDataConverter, collection} from 'firebase/firestore'
import { AppUser} from "../../types/modeltypes";
import { db } from '../firebaseConfig';

const AppUserConverter : FirestoreDataConverter<AppUser> = {
    fromFirestore : (snapshot,options) => ({...snapshot.data(options),appUserId : snapshot.id}) as AppUser,
    toFirestore : ({appUserId,...rest}) => rest
} 

const appUserCollections = collection(db,"AppUsers").withConverter(AppUserConverter)

export const createNewUser = async (email : string) : Promise<AppUser> => {
    const docRef = doc(appUserCollections);
    await setDoc(docRef,{
        appUserId : docRef.id,
        email : email,
        username : email.split('@')[0],
        avatarUrl : 'defaultUser.png',
    })
    return findAppUserById(docRef.id);
}
export const findAppUserById = async (appUserId : string ) : Promise<AppUser> => {
    return (await getDoc(doc(appUserCollections,appUserId))).data()!;
}
export const findAppUserByEmail = async (email : string ) : Promise<AppUser> => {
    const qSnap = await getDocs(query(appUserCollections,where("email","==",email)));
    return qSnap.docs[0].data();
}
export const findAppUserByField = async (field : string,value : string) : Promise<AppUser> => {
    const qSnap = await getDocs(query(appUserCollections,where(`${field}`,"==",value)));
    return qSnap.docs[0].data();
}
export const findAllAppUsersByField = async (field : string,value : string) : Promise<AppUser[]> => {
    const qSnap = await getDocs(query(appUserCollections,where(`${field}`,"==",value)));
    return qSnap.docs.map(item => item.data());
}
export const saveUser = async (appUser : AppUser) : Promise<AppUser> => {
    await updateDoc(doc(appUserCollections,appUser.appUserId),{...appUser})
    return appUser;
}


