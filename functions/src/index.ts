import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as bodyParser from "body-parser";

//Inicializanod el servicio
admin.initializeApp(functions.config().firebase);

//Inicializamos la base de datos
const db = admin.firestore(); // Add this

//Inicializando el servicio Express
const app = express();
const mainExpressServer = express();

//Configuramos el server.
mainExpressServer.use("/api/v1", app);
mainExpressServer.use(bodyParser.json());

//Vamos a definir y exponer el nombre de nuestra fución de Google Cloud.
//el export se tiene que agregar en el archvio firebase.json.
//Con esto enrutamos todas los request que vengan con la url /api/v1/*
export const webApi = functions.https.onRequest(mainExpressServer);

/**
 * Da de alta una nueva categoría. Tiene una descripción Corta y una larga.
 * @author Diego
 */
app.post("/categories", async (request: any, response: any) => {
  try {
    const { description, shortDescription, available } = request.body;
    const data = {
      description,
      shortDescription,
      available
    };
    const categoriesRef = await db.collection("categories").add(data);
    const newCategory = await categoriesRef.get();

    response.json({
      id: categoriesRef.id,
      data: newCategory.data()
    });
  } catch (error) {
    response.status(500).send(error);
  }
});
app.get("/activities", async (request: any, response: any) => {
  try {
    const activitiesQuerySnapshot = await db.collection("activities").get();
    const activities: any[] = [];
    activitiesQuerySnapshot.forEach(doc => {
      activities.push({
        id: doc.id,
        data: doc.data()
      });
    });

    response.json(activities);
  } catch (error) {
    response.status(500).send(error);
  }
});
/**
 * Permite dar de alta una nueva actividad
 * @author Diego
 * @param request - Http Request
 * @param response - Http Response
 */
app.post("/activities", async (request: any, response: any) => {
  try {
    const data = createCategory(request);

    const activitiesRef = await db.collection("activities").add(data);
    const newActivity = await activitiesRef.get();

    response.json({
      id: activitiesRef.id,
      data: newActivity.data()
    });
  } catch (error) {
    response.status(500).send(error);
  }
});

/**
 * Da de alta una nueva actividad del tipo restaurante
 * @param request - Http Request
 */
function createCategory(request: any) {
  const {
    activityName,
    shortActivityName,
    activityAddress,
    workingTimes,
    realStarPoints,
    realStarVotes,
    mainImageUrl,
    keywords,
    available,
    category,
    subcategory
  } = request.body;
  //TODO: Se debe realizar la validación de los datos
  const data = {
    activityName,
    shortActivityName,
    activityAddress,
    workingTimes,
    realStarPoints,
    realStarVotes,
    mainImageUrl,
    keywords,
    available,
    category,
    subcategory
  };
  return data;
}
