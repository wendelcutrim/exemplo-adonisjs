import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Application from "@ioc:Adonis/Core/Application";
import { randomUUID } from "node:crypto";
import Publication from "App/Models/Publication";

type ResponseData = {
  message: string;
  data: Object | Object[];
};

export default class PublicationsController {
  private validationOptions = {
    types: ["image"],
    size: "2mb",
  };

  public async store({ request, response }: HttpContextContract) {
    const body = request.body();
    const image = request.file("image", this.validationOptions);

    if (image) {
      const imageName = `${randomUUID()}.${image.extname}`;
      await image.move(Application.tmpPath("uploads"), { name: imageName });
      body.image = imageName;
    }

    const publication = await Publication.create(body);

    response.status(201);
    const responseReturn: ResponseData = {
      message: "Created publication!",
      data: publication,
    };

    return responseReturn;
  }

  public async index() {
    const publications = await Publication.all();

    const responseReturn: ResponseData = {
      message: "Created publication!",
      data: publications,
    };

    return responseReturn;
  }

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const publication = await Publication.findOrFail(id);
    response.status(200);

    const responseReturn: ResponseData = {
      message: "Find publication!",
      data: publication,
    };

    return responseReturn;
  }

  public async destroy({ request, response }: HttpContextContract) {
    const { id } = request.params();
    const publication = await Publication.findOrFail(id);
    await publication.delete();

    response.status(204);
    return { message: "Publication deleted successfully" };
  }
}
