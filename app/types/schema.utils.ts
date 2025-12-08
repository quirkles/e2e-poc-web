import { Timestamp } from '@firebase/firestore';
import { z } from 'zod';

export const firebaseTimestamp = () => z.instanceof(Timestamp);
