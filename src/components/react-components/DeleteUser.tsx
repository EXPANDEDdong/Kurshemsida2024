import fetchJson from "@utils/fetchJson";
import { createRef } from "preact";
import { useState } from "preact/hooks";

export default function DeleteUser() {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });

  const ref = createRef();

  const handleInput = (e: any) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const openModal = () => {
    if (ref.current) {
      ref.current.showModal();
    }
  };

  const closeModal = () => {
    if (ref.current) {
      ref.current.close();
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    await fetchJson("/api/users/deleteuser", {
      method: "DELETE",
      body: JSON.stringify(userInfo),
    });
  };
  return (
    <div>
      <button
        onClick={openModal}
        className={"btn btn-block btn-error btn-outline"}
      >
        Delete Account
      </button>
      <dialog ref={ref} className={"modal"}>
        <div className={"modal-box border border-error"}>
          <div className={"w-full h-full flex flex-col items-center"}>
            <h3 className={"text-2xl font-semibold"}>WARNING</h3>
            <h4 className={"text-lg text-center"}>
              This will permanently delete your account and all of the data
              associated with it
            </h4>

            <div className={"divider"}></div>
            <p className={"my-2"}>
              Please enter your account information to confirm
            </p>
            <form onSubmit={handleSubmit} className={"w-full"}>
              <div className={"w-full flex flex-col gap-4"}>
                <div className={"w-full"}>
                  <label
                    className="block text-sm font-bold mb-1"
                    htmlFor="email"
                  >
                    E-Mail:
                  </label>
                  <input
                    type="email"
                    name={"email"}
                    value={userInfo.email}
                    onInput={handleInput}
                    className={"input input-bordered w-full"}
                  />
                </div>
                <div className={"w-full"}>
                  <label
                    className="block text-sm font-bold mb-1"
                    htmlFor="password"
                  >
                    Password:
                  </label>
                  <input
                    type="password"
                    name={"password"}
                    value={userInfo.password}
                    onInput={handleInput}
                    className={"input input-bordered w-full"}
                  />
                </div>
                <div className={"divider"}></div>
                <button type={"submit"} className={"btn btn-block btn-error"}>
                  Delete Account
                </button>
              </div>
            </form>
          </div>
        </div>
        <button onClick={closeModal} className={"modal-backdrop"}></button>
      </dialog>
    </div>
  );
}
