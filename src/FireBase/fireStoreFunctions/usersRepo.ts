
import { getDoc,doc, setDoc, query, where, getDocs, updateDoc, FirestoreDataConverter, collection} from 'firebase/firestore'
import { AppUser} from "../../types/modeltypes";
import { db } from '../firebaseConfig';
import { downloadImage } from '../fireStorage';

const AppUserConverter : FirestoreDataConverter<AppUser> = {
    fromFirestore : (snapshot,options) => ({...snapshot.data(options),appUserId : snapshot.id}) as AppUser,
    toFirestore : ({appUserId,...rest}) => rest
} 

export const appUserCollections = collection(db,"AppUsers").withConverter(AppUserConverter)

export const convertAppUserToDownloadable = async (appUserData : AppUser) : Promise<AppUser> =>({
    ...appUserData,
    avatarUrl : await downloadImage(appUserData.avatarUrl)
})



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
    const result = (await getDoc(doc(appUserCollections,appUserId))).data()!;
    return convertAppUserToDownloadable(result);
}

export const findAllUsersByIdArray = async (userIds : string[]) : Promise<AppUser[]> =>{
    const qSnap = await getDocs( query(appUserCollections,where('appUserId','in',userIds)) );
    const result : AppUser[] = qSnap.docs.map(rs => rs.data());
    return Promise.all(result.map(convertAppUserToDownloadable));
}

export const findAppUserByEmail = async (email : string ) : Promise<AppUser> => {
    const qSnap = await getDocs(query(appUserCollections,where("email","==",email)));
    const result : AppUser = qSnap.docs[0].data();
    return convertAppUserToDownloadable(result)
}
export const findAppUserByField = async (field : string,value : string) : Promise<AppUser> => {
    const qSnap = await getDocs(query(appUserCollections,where(`${field}`,"==",value)));
    const result : AppUser = qSnap.docs[0].data();
    return convertAppUserToDownloadable(result)
}
export const findAllAppUsersByField = async (field : string,value : string) : Promise<AppUser[]> => {
    const qSnap = await getDocs(query(appUserCollections,where(`${field}`,"==",value)));
    const result = 
        qSnap.docs
        .map(item => item.data())
        .map(convertAppUserToDownloadable)

    return Promise.all(result)
}
export const saveUser = async (appUser : AppUser) : Promise<AppUser> => {
    await updateDoc(doc(appUserCollections,appUser.appUserId),{...appUser})
    return findAppUserById(appUser.appUserId);
}


