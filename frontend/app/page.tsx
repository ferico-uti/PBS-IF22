"use client";
import {
  faBullhorn,
  faPencil,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import useSWR from "swr";
import style from "./style.module.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// buat fungsi set token jwt
const setTokenJwt = async () => {
  await axios
    .post(`${process.env.NEXT_PUBLIC_URL_JWT}`, {
      code: "uti",
    })
    .then((response) => {
      // simpan token di local storage
      localStorage.setItem("token", response.data.meta_data.token);
    });
};

// buat variabel fetcher
const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  }).then((res) => res.json());

export default function Home() {
  // buat variabel router
  const router = useRouter();

  // buat hook "useRef"
  const modalRef = useRef<HTMLDialogElement>(null);
  const modalContentRef = useRef<HTMLParagraphElement>(null);

  // buat hook "useState"
  const [idUser, setIdUser] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [toastStatus, setToastStatus] = useState(0);

  // buat hook "useEffect"
  useEffect(() => {
    // panggil fungsi setTokenJwt
    setTokenJwt();

    // setting toast tampil selama 3 detik
    const timer = setInterval(() => {
      setToastVisible(false);
    }, 3000);

    // kembalikan nilai interval ke awal
    return () => clearInterval(timer);
  }, [toastVisible]);

  // buat variabel untuk SWR
  const { data, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_URL_USER}`,
    fetcher
  );

  // buat fungsi untuk buka "modal"
  const openModal = (id: string, nama: string) => {
    modalRef.current?.showModal();
    modalContentRef.current!.innerHTML = `${process.env.NEXT_PUBLIC_USER_TEXT} <strong>${nama}</strong> ${process.env.NEXT_PUBLIC_DELETE_MESSAGE}`;

    // simpan state "setIdUser"
    setIdUser(id);
  };

  // buat fungsi untuk "hapus data"
  const setDelete = async (id: string) => {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_URL_USER}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // kondisi jika status 401
    if (response.data.meta_data.status == 401) {
      // alihkan ke halaman 401
      router.push("/401");
    } else {
      mutate(data);
      setToastVisible(true);
      setToastMessage(response.data.meta_data.message);
      setToastStatus(response.data.meta_data.error);
    }
  };

  return (
    <div>
      <title>{`${process.env.NEXT_PUBLIC_VIEW_TEXT} ${process.env.NEXT_PUBLIC_USER_TEXT}`}</title>

      {/* buat tombol Tambah Data */}
      <section className="text-right">
        <Link
          href={"/add"}
          className="btn btn-success mr-1.5 w-50 h-13 text-white">
          {process.env.NEXT_PUBLIC_ADD_TEXT}
        </Link>
      </section>

      {/* buat tabel */}
      <section className="overflow-x-auto mt-5">
        <table className="table">
          {/* head */}
          <thead>
            <tr className={style["background-tr"]}>
              <th className="text-center w-1/8">
                {process.env.NEXT_PUBLIC_ACTION_TEXT}
              </th>
              <th className="text-center w-5/8">
                {process.env.NEXT_PUBLIC_USER_NAME_TEXT}
              </th>
              <th className="text-center w-1/8">
                {process.env.NEXT_PUBLIC_USER_USERNAME_TEXT}
              </th>
              <th className="text-center w-1/8">
                {process.env.NEXT_PUBLIC_USER_PASSWORD_TEXT}
              </th>
            </tr>
          </thead>
          <tbody>
            {/* row 2 */}
            {/* loading data */}
            {isLoading && (
              <tr>
                <td colSpan={4} className="text-center">
                  {process.env.NEXT_PUBLIC_LOADING_TEXT}
                </td>
              </tr>
            )}
            {/* awal looping "map" */}
            {data?.meta_data.error === 1 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  {data?.meta_data.message}
                </td>
              </tr>
            ) : (
              data?.data_user.map((item: any) => (
                <tr className="hover:bg-indigo-50" key={item.id}>
                  <td className="text-center">
                    <Link
                      href={`/edit/${item.id}`}
                      title={process.env.NEXT_PUBLIC_EDIT_TEXT}
                      className={style["frame-button-edit"]}>
                      <FontAwesomeIcon icon={faPencil} />
                    </Link>

                    <Link
                      href={"/"}
                      title={process.env.NEXT_PUBLIC_DELETE_TEXT}
                      className={style["frame-button-delete"]}
                      onClick={() => {
                        openModal(item.id, item.nama);
                      }}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Link>
                  </td>
                  <td className="text-left">{item.nama}</td>
                  <td className="text-center">{item.username}</td>
                  <td className="text-center">
                    <div className={style["text-ellipsis"]}>
                      {process.env.NEXT_PUBLIC_PASSWORD_TEXT}
                    </div>
                  </td>
                </tr>
              ))
            )}

            {/* akhir looping "map" */}
          </tbody>
        </table>
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

      {/* buat modal */}
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg pb-2.5 border-b-1 border-gray-500">
            <span className="mr-2.5">
              <FontAwesomeIcon icon={faBullhorn} />
            </span>
            {process.env.NEXT_PUBLIC_INFORMATION_TEXT}
          </h3>
          <p className="py-4" ref={modalContentRef}></p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn btn-success text-white mr-1.5 w-25 "
                onClick={() => {
                  setDelete(idUser);
                }}>
                {process.env.NEXT_PUBLIC_YES_BUTTON}
              </button>
              <button className="btn btn-soft ml-1.5 w-25">
                {process.env.NEXT_PUBLIC_NO_BUTTON}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
