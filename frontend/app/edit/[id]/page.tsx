"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import React, { useEffect, useRef, useState } from "react";

export default function EditUser({ params }: { params: { id: string } }) {
  // buat variabel router
  const router = useRouter();

  // buat variabel untuk respon "slug"
  params = useParams();

  //   buat hook "useState" untuk show/hide pesan error
  const [errorNamaVisible, setErrorNamaVisible] = useState(false);
  const [errorUsernameVisible, setErrorUsernameVisible] = useState(false);
  const [errorPasswordVisible, setErrorPasswordVisible] = useState(false);

  // buat hook "useState" untuk pesan error
  const [errorMessageNama, setErrorMessageNama] = useState("");
  const [errorMessageUsername, setErrorMessageUsername] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");

  // buat hook "useState" untuk toast
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastStatus, setToastStatus] = useState(0);

  // buat hook "useRef" untuk detail data
  const dataNama = useRef<HTMLInputElement>(null);
  const dataUsername = useRef<HTMLInputElement>(null);
  const dataPassword = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // panggil fungsi "getDetail"
    getDetail(params.id);

    // isi pesan error
    setErrorMessageNama(
      `${process.env.NEXT_PUBLIC_USER_NAME_TEXT} ${process.env.NEXT_PUBLIC_USER_TEXT} ${process.env.NEXT_PUBLIC_EMPTY_MESSAGE}`
    );
    setErrorMessageUsername(
      `${process.env.NEXT_PUBLIC_USER_USERNAME_TEXT} ${process.env.NEXT_PUBLIC_USER_TEXT} ${process.env.NEXT_PUBLIC_EMPTY_MESSAGE}`
    );
    setErrorMessagePassword(
      `${process.env.NEXT_PUBLIC_USER_PASSWORD_TEXT} ${process.env.NEXT_PUBLIC_USER_TEXT} ${process.env.NEXT_PUBLIC_EMPTY_MESSAGE}`
    );
    // setting toast tampil selama 3 detik
    const timer = setInterval(() => {
      setToastVisible(false);
    }, 3000);

    // kembalikan nilai interval ke awal
    return () => clearInterval(timer);
  }, [toastVisible]);

  // buat fungsi untuk reload
  const setReload = () => {
    // alihkan ke "home page"
    router.push("/");
  };

  // buat fungsi untuk ambil data
  const getDetail = async (id: string) => {
    // ambil service "detail"
    await axios
      .get(`${process.env.NEXT_PUBLIC_URL_USER}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        // kondisi jika status 404
        if (response.data.meta_data.status == 404) {
          // alihkan ke halaman 404
          router.push("/404");
          // notFound
        }
        // kondisi jika status 400
        else if (response.data.meta_data.status == 400) {
          // alihkan ke halaman 400
          router.push("/400");
        }
        // kondisi jika status 401
        else if (response.data.meta_data.status == 401) {
          // alihkan ke halaman 401
          router.push("/401");
        }
        // kondisi jika status 200
        else {
          dataNama.current!.value = response.data.data_user.nama;
          dataUsername.current!.value = response.data.data_user.username;
          dataPassword.current!.value = `${process.env.NEXT_PUBLIC_PASSWORD_TEXT}`;
        }
      });
  };

  // buat fungsi untuk ubah data
  const setUpdate = async () => {
    // jika "txt_nama" tidak diisi
    dataNama.current!.value == ""
      ? setErrorNamaVisible(true)
      : // jika "txt_nama" diisi
        setErrorNamaVisible(false);

    // jika "txt_username" tidak diisi
    dataUsername.current!.value == ""
      ? setErrorUsernameVisible(true)
      : // jika "txt_username" diisi
        setErrorUsernameVisible(false);

    // jika "txt_password" tidak diisi
    dataPassword.current!.value == ""
      ? setErrorPasswordVisible(true)
      : // jika "txt_password" diisi
        setErrorPasswordVisible(false);

    // jika seluruh data terisi
    if (
      dataNama.current!.value != "" &&
      dataUsername.current!.value != "" &&
      dataPassword.current!.value != ""
    ) {
      await axios
        .put(
          `${process.env.NEXT_PUBLIC_URL_USER}/${params.id}`,
          {
            nama_value: dataNama.current!.value,
            username_value: dataUsername.current!.value,
            password_value: dataPassword.current!.value,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          // kondisi jika status 401
          if (response.data.meta_data.status == 401) {
            // alihkan ke halaman 400
            router.push("/401");
          } else {
            setToastVisible(true);
            setToastMessage(response.data.meta_data.message);
            setToastStatus(response.data.meta_data.error);

            // jika response error = 0
            if (response.data.meta_data.error == 0) {
              // refresh halaman
              router.refresh();
            }
          }
        });
    }
  };

  return (
    <div>
      <title>{`${process.env.NEXT_PUBLIC_EDIT_TEXT} ${process.env.NEXT_PUBLIC_USER_TEXT}`}</title>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{`${process.env.NEXT_PUBLIC_USER_NAME_TEXT} ${process.env.NEXT_PUBLIC_USER_TEXT}`}</legend>
        <input
          ref={dataNama}
          type="text"
          className={
            errorNamaVisible
              ? "input  border-error focus:border-success focus:outline-0 w-128"
              : "input border-gray-300 focus:border-success focus:outline-0 w-128"
          }
          placeholder={`${process.env.NEXT_PUBLIC_FILL_TEXT} ${process.env.NEXT_PUBLIC_USER_NAME_TEXT} ${process.env.NEXT_PUBLIC_USER_TEXT}`}
        />
        {errorNamaVisible && (
          <p className="label text-error">{errorMessageNama}</p>
        )}
      </fieldset>

      <fieldset className="fieldset my-2.5">
        <legend className="fieldset-legend">{`${process.env.NEXT_PUBLIC_USER_USERNAME_TEXT} ${process.env.NEXT_PUBLIC_USER_TEXT}`}</legend>
        <input
          ref={dataUsername}
          type="text"
          className={
            errorUsernameVisible
              ? "input  border-error focus:border-success focus:outline-0 w-128"
              : "input border-gray-300 focus:border-success focus:outline-0 w-128"
          }
          placeholder={`${process.env.NEXT_PUBLIC_FILL_TEXT} ${process.env.NEXT_PUBLIC_USER_USERNAME_TEXT} ${process.env.NEXT_PUBLIC_USER_TEXT}`}
        />
        {errorUsernameVisible && (
          <p className="label text-error">{errorMessageUsername}</p>
        )}
      </fieldset>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">{`${process.env.NEXT_PUBLIC_USER_PASSWORD_TEXT} ${process.env.NEXT_PUBLIC_USER_TEXT}`}</legend>
        <input
          ref={dataPassword}
          type="password"
          className={
            errorPasswordVisible
              ? "input  border-error focus:border-success focus:outline-0 w-128"
              : "input border-gray-300 focus:border-success focus:outline-0 w-128"
          }
          placeholder={`${process.env.NEXT_PUBLIC_FILL_TEXT} ${process.env.NEXT_PUBLIC_USER_PASSWORD_TEXT} ${process.env.NEXT_PUBLIC_USER_TEXT}`}
        />
        {errorPasswordVisible && (
          <p className="label text-error">{errorMessagePassword}</p>
        )}
      </fieldset>

      <section className="mt-10">
        <button
          className="btn btn-success mr-1.5 w-35 h-13 text-white"
          onClick={setUpdate}>
          {process.env.NEXT_PUBLIC_EDIT_BUTTON}
        </button>
        <button className="btn btn-soft ml-1.5 w-35 h-13" onClick={setReload}>
          {process.env.NEXT_PUBLIC_CANCEL_BUTTON}
        </button>
      </section>

      {/* buat toast */}
      {toastVisible && (
        <div className="toast toast-top toast-end">
          {toastStatus == 0 ? (
            // jika response error = 0
            <div className="alert alert-success text-white">
              <span>{toastMessage}</span>
            </div>
          ) : (
            // jika response error = 1
            <div className="alert alert-error text-white">
              <span>{toastMessage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
