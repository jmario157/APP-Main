import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { servidor } from "../apiUrls";
export const AxiosPublico = axios.create({
    baseURL: servidor,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});
export const AxiosPrivado = axios.create({
    baseURL: servidor,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});
export const AxiosImagen = axios.create({
    baseURL: servidor,
    timeout: 10000,
    headers: { 'Content-Type': 'multipart/form-data' }
});
